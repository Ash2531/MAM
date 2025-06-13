import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { EventData, StreamData } from '../types/graphql.types';

@Injectable({
  providedIn: 'root'
})
export class GraphqlSseService {
  private eventSource: EventSource | null = null;
  private reconnectAttempts = 0;
  private maxRetries = environment.graphql.sse.maxRetries;
  private reconnectInterval = environment.graphql.sse.reconnectInterval;

  // Signals for real-time data
  public eventData = signal<EventData[]>([]);
  public streamData = signal<StreamData | null>(null);
  public connectionStatus = signal<'connected' | 'disconnected' | 'connecting'>('disconnected');

  private currentStreamStatus: 'ACTIVE' | 'PAUSED' = 'ACTIVE';

  constructor() {
    if (environment.graphql.sse.enabled) {
      this.connect();
    }
  }

  public connect(): void {
    this.connectionStatus.set('connecting');

    const url = environment.graphql.sse.endpoint;
    this.eventSource = new EventSource(url);

    this.eventSource.onopen = () => {
      this.connectionStatus.set('connected');
      this.reconnectAttempts = 0;
      console.log('SSE connection established');
    };

    this.eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleSSEData(data);
      } catch (error) {
        console.error('Error parsing SSE message:', error);
      }
    };

    this.eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
      this.connectionStatus.set('disconnected');
      this.reconnect();
    };
  }

  private handleSSEData(data: any): void {
    console.log('Received SSE data:', data); // Debugging log
    if (data.type === 'EVENT' && data.data) {
      const events = [...this.eventData()]; // Create a new array to trigger change detection
      events.push(data.data);
      this.eventData.set(events);
    } else if (data.type === 'STREAM' && data.data) {
      this.streamData.set(data.data);
    }
  }

  private reconnect(): void {
    if (this.reconnectAttempts < this.maxRetries) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxRetries})...`);

      setTimeout(() => {
        if (this.eventSource) {
          this.eventSource.close();
        }
        this.connect();
      }, this.reconnectInterval);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  public disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
      this.connectionStatus.set('disconnected');
    }
  }

  public clearEventData(): void {
    this.eventData.set([]);
  }

  public async createTestEvent(): Promise<void> {
    try {
      const response = await fetch(environment.graphql.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation {
              createEvent(
                type: "INFO"
                message: "Test event from Angular"
              ) {
                id
                timestamp
                type
                message
              }
            }
          `
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create test event');
      }

      const result = await response.json();
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }
    } catch (error) {
      console.error('Error creating test event:', error);
      throw error; // Re-throw the error to handle it in the component
    }
  }

  public async createManualEvent(type: string, message: string): Promise<void> {
    try {
      const response = await fetch(environment.graphql.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation {
              createEvent(
                type: "${type}"
                message: "${message}"
              ) {
                id
                timestamp
                type
                message
              }
            }
          `
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create manual event');
      }

      const result = await response.json();
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }
    } catch (error) {
      console.error('Error creating manual event:', error);
      throw error; // Re-throw the error to handle it in the component
    }
  }

  public async updateStreamStatus(): Promise<void> {
    console.log('updateStreamStatus method called');
    try {
      const newStatus = this.currentStreamStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
      console.log('Toggling stream status to:', newStatus);

      const response = await fetch(environment.graphql.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation {
              updateStream(
                id: "1"
                status: "${newStatus}"
              ) {
                id
                status
              }
            }
          `
        })
      });

      console.log('Fetch request resolved. Response status:', response.status);

      if (!response.ok) {
        console.error('GraphQL mutation response not OK:', response.status);
        throw new Error(`Failed to update stream status: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('GraphQL mutation response JSON:', result);

      if (result.errors) {
        console.error('GraphQL mutation errors:', result.errors);
        throw new Error(result.errors[0].message);
      }

      console.log('Stream status updated successfully via mutation.');
      this.currentStreamStatus = newStatus;

    } catch (error) {
      console.error('Error during updateStreamStatus fetch:', error);
    }
  }
}
