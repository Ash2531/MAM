const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { json } = require('body-parser');
const cors = require('cors');
const { typeDefs } = require('./schema');
const { resolvers, addSSEClient, removeSSEClient } = require('./resolvers');

const app = express();
const port = process.env.PORT || 4000;

// Enable CORS
app.use(cors());

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// SSE endpoint
app.get('/graphql/sse', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Send initial connection message
  res.write(`data: ${JSON.stringify({ type: 'CONNECTED' })}\n\n`);

  // Add this client to SSE clients
  addSSEClient(res);

  // Handle client disconnect
  req.on('close', () => {
    removeSSEClient(res);
  });
});

// Start server
async function startServer() {
  await server.start();
  
  app.use('/graphql', json(), expressMiddleware(server));

  app.listen(port, () => {
    console.log(`🚀 GraphQL Server ready at http://localhost:${port}/graphql`);
    console.log(`🚀 GraphQL SSE ready at http://localhost:${port}/graphql/sse`);
  });
}

startServer(); 