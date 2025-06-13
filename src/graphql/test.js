const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const EventSource = require('eventsource');

// Test queries
async function testQueries() {
  try {
    // Test getEvents query
    const getEventsResult = await fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query {
            getEvents {
              id
              timestamp
              type
              message
            }
          }
        `
      })
    }).then(res => res.json());
    console.log('Get Events Result:', getEventsResult);

    // Test getStreams query
    const getStreamsResult = await fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query {
            getStreams {
              id
              url
              type
              quality
              status
            }
          }
        `
      })
    }).then(res => res.json());
    console.log('Get Streams Result:', getStreamsResult);

    // Test createEvent mutation
    const createEventResult = await fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation {
            createEvent(
              type: "INFO"
              message: "Test event created"
              metadata: { test: "data" }
            ) {
              id
              timestamp
              type
              message
              metadata
            }
          }
        `
      })
    }).then(res => res.json());
    console.log('Create Event Result:', createEventResult);

    // Test updateStream mutation
    const updateStreamResult = await fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation {
            updateStream(
              id: "1"
              status: "PAUSED"
            ) {
              id
              status
            }
          }
        `
      })
    }).then(res => res.json());
    console.log('Update Stream Result:', updateStreamResult);

    // Test SSE subscription
    console.log('Starting SSE subscription...');
    const eventSource = new EventSource('http://localhost:4000/graphql/sse');

    eventSource.onmessage = (event) => {
      console.log('SSE Update:', event.data);
    };

    eventSource.onerror = (error) => {
      console.error('SSE Error:', error);
    };

    // Keep subscription alive for 5 seconds
    await new Promise(resolve => setTimeout(resolve, 5000));
    eventSource.close();

  } catch (error) {
    console.error('Test Error:', error);
  }
}

// Run tests
testQueries().catch(console.error); 