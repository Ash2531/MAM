import { Injectable } from '@angular/core';
import { createClient } from 'graphql-sse';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { SubscribePayload } from './types';

export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting';

@Injectable({ providedIn: 'root' })
export class SseService {
  private connectionStatus = new BehaviorSubject<ConnectionStatus>('disconnected');
  private cleanupFn?: () => void;
  private destroyed = new Subject<void>();

  private client = createClient({
    url: 'http://localhost:5000/graphql/stream',
    retry: async (retries: number) => {
      const baseDelay = 1000;
      const maxDelay = 10000;
      const delay = Math.min(baseDelay * Math.pow(2, retries), maxDelay);
      console.log(`🔄 Retrying connection in ${delay / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    },
  });

  getConnectionStatus(): Observable<ConnectionStatus> {
    return this.connectionStatus.asObservable();
  }

  connect<T>(payload: SubscribePayload): Observable<T> {
    console.log('📡 Starting subscription...');
    this.connectionStatus.next('connecting');

    return new Observable((observer) => {
      this.cleanupFn = this.client.subscribe<any>(payload, {
        next: (result) => {
          if (result?.data) {
            console.log('📨 Received:', result.data);
            this.connectionStatus.next('connected');
            observer.next(result.data);
          }
        },
        error: (err) => {
          console.error('❌ Subscription error:', err);
          this.connectionStatus.next('disconnected');
          observer.error(err);
        },
        complete: () => {
          console.log('👋 Subscription completed');
          this.connectionStatus.next('disconnected');
          observer.complete();
        },
      });

      return () => {
        this.disconnect();
      };
    });
  }

  disconnect(): void {
    console.log('🔌 Disconnecting from server...');
    if (this.cleanupFn) {
      this.cleanupFn();
      this.cleanupFn = undefined;
    }
    this.connectionStatus.next('disconnected');
  }

  ngOnDestroy(): void {
    this.disconnect();
    this.destroyed.next();
    this.destroyed.complete();
  }
}
