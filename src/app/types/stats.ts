export interface ConnectionStats {
  connectedAt?: Date;
  messageCount: number;
  messagesPerMinute: number;
  lastMessageAt?: Date;
  connectionDuration: string;
}
