export interface EventData {
  id: string;
  timestamp: string;
  type: 'INFO' | 'WARNING' | 'ERROR';
  message: string;
  metadata?: Record<string, any>;
}

export interface StreamData {
  id: string;
  url: string;
  type: 'DASH' | 'HLS';
  quality: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'ACTIVE' | 'INACTIVE';
}

export interface SubscriptionResponse {
  eventData: EventData;
  streamData: StreamData;
} 