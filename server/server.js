const express = require('express');
const cors = require('cors');
const { createHandler } = require('graphql-sse/lib/use/express');
const { GraphQLSchema, GraphQLObjectType, GraphQLString } = require('graphql');


const app = express();
app.use(cors({ origin: 'http://localhost:4200' }));

let counter = 0;

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      hello: {
        type: GraphQLString,
        resolve: () => 'Hello from backend!',
      },
    },
  }),
  subscription: new GraphQLObjectType({
    name: 'Subscription',
    fields: {
      messageAdded: {
        type: GraphQLString,
        subscribe: async function* () {
          while (true) {
            await new Promise((res) => setTimeout(res, 10000));
            yield { messageAdded: `Message #${++counter}` };
          }
        },
      },
    },
  }),
});

const handler = createHandler({ schema });

app.use('/graphql/stream', async (req, res) => {
  try {
    await handler(req, res);
  } catch (err) {
    console.error('GraphQL SSE Error:', err);
    res.status(500).end();
  }
});

app.listen(5000, () => console.log('✅ Backend: http://localhost:5000/graphql/stream'));
