const { gql } = require('graphql-tag');

const typeDefs = gql`
  type EventData {
    id: ID!
    timestamp: String!
    type: String!
    message: String!
    metadata: JSON
  }

  type StreamData {
    id: ID!
    url: String!
    type: String!
    quality: String!
    status: String!
  }

  type SubscriptionResponse {
    eventData: EventData
    streamData: StreamData
  }

  scalar JSON

  type Query {
    getEvents: [EventData!]!
    getStreams: [StreamData!]!
  }

  type Mutation {
    createEvent(type: String!, message: String!, metadata: JSON): EventData!
    updateStream(id: ID!, status: String!): StreamData!
  }

  type Subscription {
    subscriptionData: SubscriptionResponse!
  }
`;

module.exports = typeDefs; 