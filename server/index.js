const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { createServer } = require('http');
const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/lib/use/ws');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { createHandler } = require('graphql-sse/lib/use/express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { PubSub } = require('graphql-subscriptions');

// Create PubSub instance for real-time events
const pubsub = new PubSub();

// Store SSE clients
const sseClients = new Set();

// Function to broadcast to all SSE clients
function broadcastToSSE(data) {
  const message = `data: ${JSON.stringify(data)}\n\n`;
  sseClients.forEach(client => {
    client.write(message);
  });
}

// Mock data
const streams = [
  {
    id: '1',
    status: 'ACTIVE',
    viewers: 0,
    lastUpdated: new Date().toISOString(),
    url: 'https://example.com/stream1',
    type: 'live',
    quality: 'HD'
  }
];

// GraphQL Schema
const typeDefs = `
  type Event {
    id: ID!
    type: String!
    message: String!
    timestamp: String!
  }

  type Stream {
    id: ID!
    url: String!
    type: String!
    quality: String!
    status: String!
  }

  type Query {
    events: [Event!]!
    stream: Stream!
  }

  type Mutation {
    createEvent(type: String!, message: String!): Event!
    updateStream(id: ID!, status: String!): Stream!
  }

  type Subscription {
    eventCreated: Event!
    streamUpdated: Stream!
    messageAdded: String!
  }
`;

let messageCounter = 0;

// Resolvers
const resolvers = {
  Query: {
    events: () => [],
    stream: () => streams[0]
  },
  Mutation: {
    createEvent: (_, { type, message }) => {
      const event = {
        id: Date.now().toString(),
        type,
        message,
        timestamp: new Date().toISOString()
      };

      // Publish to both WebSocket subscribers and SSE clients
      pubsub.publish('EVENT_CREATED', { eventCreated: event });
      broadcastToSSE({
        type: 'EVENT',
        data: event
      });

      return event;
    },
    updateStream: (_, { id, status }) => {
      const stream = streams.find(s => s.id === id);
      if (!stream) throw new Error('Stream not found');

      stream.status = status;
      stream.lastUpdated = new Date().toISOString();

      // Publish to both WebSocket subscribers and SSE clients
      pubsub.publish('STREAM_UPDATED', { streamUpdated: stream });
      broadcastToSSE({
        type: 'STREAM',
        data: stream
      });

      return stream;
    }
  },
  Subscription: {
    eventCreated: {
      subscribe: () => pubsub.asyncIterator(['EVENT_CREATED'])
    },
    streamUpdated: {
      subscribe: () => pubsub.asyncIterator(['STREAM_UPDATED'])
    },
    messageAdded: {
      subscribe: async function* () {
        while (true) {
          await new Promise(resolve => setTimeout(resolve, 10000));
          const message = `Message #${++messageCounter}`;
          yield { messageAdded: message };
        }
      }
    }
  }
};

// Create schema
const schema = makeExecutableSchema({ typeDefs, resolvers });

// Create Express app
const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept', 'Connection', 'Cache-Control', 'Authorization'],
  exposedHeaders: ['Content-Type', 'Accept'],
  credentials: true
}));

app.use(bodyParser.json());

// Create HTTP server
const httpServer = createServer(app);

// Create Apollo Server
const server = new ApolloServer({
  schema,
  plugins: [
    {
      async serverWillStart() {
        // Create WebSocket server
        const wsServer = new WebSocketServer({
          server: httpServer,
          path: '/graphql'
        });

        // Set up WebSocket server with schema
        useServer({ schema }, wsServer);

        return {
          async drainServer() {
            await wsServer.close();
          }
        };
      }
    }
  ]
});

// Create SSE handler
const sseHandler = createHandler({ schema });

// Start server
async function startServer() {
  await server.start();
  // Apply Apollo middleware with context
  app.use('/graphql', expressMiddleware(server, {
    context: async ({ req }) => ({ req })
  }));

  // Set up SSE endpoint with graphql-sse handler
  app.use('/graphql/stream', async (req, res) => {
    try {
      await sseHandler(req, res);
    } catch (err) {
      console.error('GraphQL SSE Error:', err);
      res.status(500).end();
    }
  });

  // Legacy SSE endpoint (keeping for compatibility)
  app.get('/sse', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    // Send initial connection message
    res.write(`data: ${JSON.stringify({
      type: 'CONNECTED',
      data: {
        message: 'SSE connection established',
        timestamp: new Date().toISOString()
      }
    })}\n\n`);

    // Add this client to SSE clients
    sseClients.add(res);

    // Send current stream data on connection
    if (streams.length > 0) {
      res.write(`data: ${JSON.stringify({
        type: 'STREAM',
        data: streams[0]
      })}\n\n`);
    }

    // Send a test event every 5 seconds
    const testInterval = setInterval(() => {
      res.write(`data: ${JSON.stringify({
        type: 'EVENT',
        data: {
          id: Date.now().toString(),
          type: 'INFO',
          message: 'Test event from server',
          timestamp: new Date().toISOString()
        }
      })}\n\n`);
    }, 50000);

    // Keep connection alive
    const keepAliveInterval = setInterval(() => {
      res.write(': keepalive\n\n');
    }, 300000);

    // Clean up on client disconnect
    req.on('close', () => {
      console.log('SSE client disconnected');
      sseClients.delete(res);
      clearInterval(testInterval);
      clearInterval(keepAliveInterval);
    });
  });

  // Start HTTP server
  const PORT = 4000;
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
    console.log(`🚀 WebSocket subscriptions ready at ws://localhost:${PORT}/graphql`);
    console.log(`🚀 SSE subscriptions ready at http://localhost:${PORT}/graphql/stream`);
    console.log(`🚀 Legacy SSE endpoint at http://localhost:${PORT}/sse`);
  });
}

startServer();
