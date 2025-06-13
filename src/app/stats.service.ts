import { Injectable } from '@angular/core';
import { signal } from '@angular/core';

export interface ConnectionStats {
  connectedAt?: Date;
  messageCount: number;
  messagesPerMinute: number;
  lastMessageAt?: Date;
  connectionDuration: string;
}

@Injectable({ providedIn: 'root' })
export class StatsService {
  private stats = signal<ConnectionStats>({
    messageCount: 0,
    messagesPerMinute: 0,
    connectionDuration: '0:00'
  });

  private updateInterval?: number;
  private messages: Date[] = [];
  private totalMessageCount = 0;

  getStats() {
    return this.stats;
  }

  startConnection() {
    const now = new Date();
    this.totalMessageCount = 0;
    this.messages = [];
    this.stats.update(s => ({
      ...s,
      connectedAt: now,
      messageCount: 0,
      messagesPerMinute: 0,
      connectionDuration: '0:00'
    }));

    this.updateInterval = window.setInterval(() => {
      this.updateStats();
    }, 1000);
  }

  stopConnection() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = undefined;
    }
    this.messages = [];
    this.totalMessageCount = 0;
    this.stats.update(s => ({
      ...s,
      connectedAt: undefined,
      lastMessageAt: undefined,
      messageCount: 0,
      messagesPerMinute: 0,
      connectionDuration: '0:00'
    }));
  }

  recordMessage() {
    const now = new Date();
    this.messages.push(now);
    this.totalMessageCount++;

    // Keep only last minute of messages for rate calculation
    const oneMinuteAgo = now.getTime() - 60000;
    this.messages = this.messages.filter(m => m.getTime() > oneMinuteAgo);

    // Calculate messages per minute based on the actual time window
    const timeWindowMs = now.getTime() - this.stats().connectedAt!.getTime();
    const timeWindowMinutes = Math.max(timeWindowMs / 60000, 1); // At least 1 minute
    const messagesPerMinute = Math.round((this.messages.length / Math.min(timeWindowMinutes, 1)) * 10) / 10;

    this.stats.update(s => ({
      ...s,
      messageCount: this.totalMessageCount,
      lastMessageAt: now,
      messagesPerMinute
    }));
  }

  private updateStats() {
    const now = new Date();
    const connectedAt = this.stats().connectedAt;
    if (!connectedAt) return;

    const diff = now.getTime() - connectedAt.getTime();
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    let duration = '';
    if (hours > 0) {
      duration = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
      duration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    // Recalculate messages per minute
    const oneMinuteAgo = now.getTime() - 60000;
    this.messages = this.messages.filter(m => m.getTime() > oneMinuteAgo);

    const timeWindowMs = now.getTime() - connectedAt.getTime();
    const timeWindowMinutes = Math.max(timeWindowMs / 60000, 1); // At least 1 minute
    const messagesPerMinute = Math.round((this.messages.length / Math.min(timeWindowMinutes, 1)) * 10) / 10;

    this.stats.update(s => ({
      ...s,
      connectionDuration: duration,
      messagesPerMinute
    }));
  }
}
