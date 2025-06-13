const { PubSub } = require('graphql-subscriptions');
const pubsub = new PubSub();

// Mock data
const events = [];
const streams = [
  {
    id: '1',
    url: 'https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd',
    type: 'MPEG-DASH',
    quality: 'HD',
    status: 'ACTIVE'
  }
];

// Store SSE clients
const sseClients = new Set();

// Function to broadcast to all SSE clients
function broadcastToSSE(data) {
  const message = `data: ${JSON.stringify(data)}\n\n`;
  sseClients.forEach(client => {
    client.write(message);
  });
}

const resolvers = {
  Query: {
    getEvents: () => events,
    getStreams: () => streams
  },

  Mutation: {
    createEvent: (_, { type, message, metadata }) => {
      const event = {
        id: String(events.length + 1),
        timestamp: new Date().toISOString(),
        type,
        message,
        metadata
      };
      events.push(event);
      
      // Broadcast to SSE clients
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
      
      // Broadcast to SSE clients
      broadcastToSSE({
        type: 'STREAM',
        data: stream
      });
      
      return stream;
    }
  },

  Subscription: {
    subscriptionData: {
      subscribe: () => pubsub.asyncIterator(['SUBSCRIPTION_DATA'])
    }
  }
};

// Export both resolvers and SSE client management
module.exports = {
  resolvers,
  addSSEClient: (client) => sseClients.add(client),
  removeSSEClient: (client) => sseClients.delete(client)
}; 