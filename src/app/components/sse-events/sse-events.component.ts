import { Component, signal, OnDestroy, effect, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SseService, ConnectionStatus } from '../../sse.service';
import { StatsService } from '../../stats.service';
import { ToastComponent } from '../../toast.component';
import { Subscription } from 'rxjs';
import type { ConnectionStats } from '../../types/stats';

interface Message {
  id: string;
  content: string;
  timestamp: Date;
}

interface MessageGroup {
  title: string;
  messages: Message[];
}

@Component({
  selector: 'app-sse-events',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastComponent],
 template: `
    <div [class.dark]="isDarkTheme()">
      <div class="dashboard">
        <header class="dashboard-header">
          <h1 class="dashboard-title">
            📡 Live Message Stream
          </h1>
          <div class="controls">
            <div class="status-badge" [class]="connectionStatus()">
              <span class="status-dot">
                {{ connectionStatus() === 'connected' ? '🟢' :
                   connectionStatus() === 'connecting' ? '🟡' : '🔴' }}
              </span>
              {{ connectionStatus() }}
            </div>

            @if (connectionStatus() === 'disconnected') {
              <button
                class="control-button connect-button"
                (click)="connect()"
              >
                🔌 Connect
              </button>
            } @else {
              <button
                class="control-button disconnect-button"
                (click)="disconnect()"
                [disabled]="connectionStatus() === 'connecting'"
              >
                ⏹️ Disconnect
              </button>
            }

            <button
              class="tool-button"
              (click)="toggleTheme()"
              title="Toggle theme"
            >
              {{ isDarkTheme() ? '☀️' : '🌙' }}
            </button>
          </div>
        </header>

        <div class="stats-panel">
          <div class="stat-item">
            <span class="stat-label">⏱️ Connection Time</span>
            <span class="stat-value">{{ connectionStats().connectionDuration || '0:00' }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">📊 Total Messages</span>
            <span class="stat-value">{{ connectionStats().messageCount || 0 }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">⚡ Messages/min</span>
            <span class="stat-value">{{ connectionStats().messagesPerMinute || 0 }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">🕒 Last Message</span>
            <span class="stat-value">{{ connectionStats().lastMessageAt ? (connectionStats().lastMessageAt | date:'HH:mm:ss') : '-' }}</span>
          </div>
        </div>

        <div class="message-tools">
          <input
            type="text"
            class="search-box"
            placeholder="Search messages..."
            [(ngModel)]="searchTerm"
            (input)="filterMessages()"
          >

          <button
            class="tool-button"
            (click)="clearMessages()"
            [disabled]="messages().length === 0"
            title="Clear all messages"
          >
            🗑️ Clear
          </button>

          <button
            class="tool-button"
            (click)="toggleAutoScroll()"
            [style.opacity]="messages().length ? 1 : 0.5"
            [title]="autoScroll() ? 'Pause auto-scroll' : 'Resume auto-scroll'"
          >
            {{ autoScroll() ? '⏸️ Pause' : '▶️ Resume' }}
          </button>

          <button
            class="tool-button"
            (click)="exportMessages()"
            [disabled]="messages().length === 0"
            title="Export messages to JSON"
          >
            📥 Export
          </button>

          <div class="message-stats">
            📊 Messages: {{ filteredMessages().length }}
          </div>
        </div>

        <div class="message-list" #messageList>
          @if (filteredMessages().length === 0) {
            <div class="message-placeholder">
              @if (connectionStatus() === 'disconnected') {
                <p>Click connect to start receiving messages</p>
                <p style="font-size: 2rem">🔌</p>
              } @else if (messages().length === 0) {
                <p>Waiting for incoming messages...</p>
                <p style="font-size: 2rem">📨</p>
              } @else {
                <p>No messages match your search</p>
                <p style="font-size: 2rem">🔍</p>
              }
            </div>
          } @else {
            @for (group of messageGroups(); track group.title) {
              <div class="message-group">
                <h3 class="group-header">{{ group.title }}</h3>
                @for (message of group.messages; track message.id) {
                  <div class="message-card">
                    <div class="message-header">
                      <span>ID: {{ message.id }}</span>
                      <span>{{ message.timestamp | date:'medium' }}</span>
                    </div>
                    <div class="message-content">
                      {{ message.content }}
                    </div>
                    <button
                      class="tool-button copy-button"
                      (click)="copyMessage(message)"
                      title="Copy message to clipboard"
                    >
                      📋
                    </button>
                  </div>
                }
              </div>
            }
          }
        </div>
      </div>

      <div class="notification-settings">
        <button
          class="tool-button"
          (click)="toggleSound()"
          [title]="soundEnabled() ? 'Disable sound notifications' : 'Enable sound notifications'"
        >
          {{ soundEnabled() ? '🔊' : '🔇' }}
        </button>
      </div>
    </div>

    <app-toast />
  `,
    styles: [`
    :host {
      display: block;
      max-width: 800px;
      margin: 2rem auto;
      padding: 0 1rem;
      font-family: system-ui, -apple-system, sans-serif;
    }

    .dashboard {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
      overflow: hidden;
    }

    .dashboard-header {
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .dashboard-title {
      margin: 0;
      color: #0f172a;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .status-badge.connected {
      background: #dcfce7;
      color: #166534;
    }

    .status-badge.connecting {
      background: #fef9c3;
      color: #854d0e;
    }

    .status-badge.disconnected {
      background: #fee2e2;
      color: #991b1b;
    }

    .message-list {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-height: 600px;
      overflow-y: auto;
      background: #ffffff;
    }

    .message-card {
      background: #f8fafc;
      border-radius: 8px;
      padding: 1rem;
      display: grid;
      gap: 0.5rem;
      border: 1px solid #e2e8f0;
      transition: all 0.3s ease;
      animation: slide-in 0.3s ease-out;
    }

    .message-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .message-header {
      display: flex;
      justify-content: space-between;
      color: #64748b;
      font-size: 0.875rem;
    }

    .message-content {
      color: #0f172a;
      font-size: 1rem;
      line-height: 1.5;
    }

    .message-placeholder {
      text-align: center;
      color: #64748b;
      padding: 3rem;
      background: #f8fafc;
      border-radius: 8px;
      border: 2px dashed #e2e8f0;
    }

    .controls {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .control-button {
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      border: none;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .connect-button {
      background: #059669;
      color: white;
    }

    .connect-button:hover {
      background: #047857;
    }

    .disconnect-button {
      background: #dc2626;
      color: white;
    }

    .disconnect-button:hover {
      background: #b91c1c;
    }

    .control-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .dark {
      background-color: #1a1a1a;
      color: #ffffff;
    }

    .dark .dashboard {
      background: #2d2d2d;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.2);
    }

    .dark .dashboard-header {
      background: #363636;
      border-bottom-color: #404040;
    }

    .dark .message-card {
      background: #363636;
      border-color: #404040;
    }

    .dark .message-placeholder {
      background: #2d2d2d;
      border-color: #404040;
      color: #9ca3af;
    }

    .message-tools {
      padding: 1rem 1.5rem;
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      gap: 1rem;
      align-items: center;
      flex-wrap: wrap;
    }

    .dark .message-tools {
      background: #363636;
      border-bottom-color: #404040;
    }

    .search-box {
      flex: 1;
      min-width: 200px;
      padding: 0.5rem;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
      background: white;
      color: #0f172a;
      font-size: 0.875rem;
    }

    .dark .search-box {
      background: #2d2d2d;
      border-color: #404040;
      color: #ffffff;
    }

    .tool-button {
      padding: 0.5rem;
      border-radius: 6px;
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      color: #64748b;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.875rem;
      transition: all 0.2s;
    }

    .dark .tool-button {
      background: #2d2d2d;
      border-color: #404040;
      color: #9ca3af;
    }

    .tool-button:hover {
      background: #e2e8f0;
      color: #0f172a;
    }

    .dark .tool-button:hover {
      background: #404040;
      color: #ffffff;
    }

    .message-stats {
      font-size: 0.875rem;
      color: #64748b;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .dark .message-stats {
      color: #9ca3af;
    }

    .copy-button {
      opacity: 0;
      transition: opacity 0.2s;
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
    }

    .message-card {
      position: relative;
    }

    .message-card:hover .copy-button {
      opacity: 1;
    }

    @keyframes slide-in {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .stats-panel {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
      padding: 1rem 1.5rem;
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
    }

    .dark .stats-panel {
      background: #363636;
      border-bottom-color: #404040;
    }

    .stat-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #64748b;
    }

    .dark .stat-label {
      color: #9ca3af;
    }

    .stat-value {
      font-size: 1.25rem;
      font-weight: 500;
      color: #0f172a;
    }

    .dark .stat-value {
      color: #ffffff;
    }

    .notification-settings {
      position: fixed;
      bottom: 1rem;
      left: 1rem;
      background: #f8fafc;
      padding: 0.5rem;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .dark .notification-settings {
      background: #2d2d2d;
      border-color: #404040;
    }
  `],
})
export class SseEventsComponent implements OnDestroy {
   messages = signal<Message[]>([]);
  filteredMessages = signal<Message[]>([]);
  messageGroups = signal<MessageGroup[]>([]);
  connectionStatus = signal<ConnectionStatus>('disconnected');
  connectionStats = signal<ConnectionStats>({
    messageCount: 0,
    messagesPerMinute: 0,
    connectionDuration: '0:00'
  });
  isDarkTheme = signal<boolean>(false);
  autoScroll = signal<boolean>(true);
  soundEnabled = signal<boolean>(false);
  searchTerm = '';

  @ViewChild(ToastComponent) toast!: ToastComponent;
  private subscription?: Subscription;
  private notificationSound = new Audio('data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=');

  constructor(
    private gqlSse: SseService,
    private statsService: StatsService
  ) {
    // Initialize theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.isDarkTheme.set(savedTheme === 'dark');
    }

    // Initialize connection status
    this.gqlSse.getConnectionStatus().subscribe(status => {
      this.connectionStatus.set(status);
    });

    // Bind to stats service
    this.connectionStats = this.statsService.getStats();

    // Set up effects
    effect(() => {
      this.filterMessages();
      if (this.autoScroll() && this.filteredMessages().length > 0) {
        setTimeout(() => this.scrollToBottom(), 100);
      }
    });
  }

  connect(): void {
    this.messages.set([]);
    this.statsService.startConnection();

    const subscriptionQuery = `
      subscription {
        messageAdded
      }
    `;

    this.subscription = this.gqlSse.connect<{ messageAdded: string }>({
      query: subscriptionQuery
    }).subscribe({
      next: ({ messageAdded }) => {
        const id = messageAdded.split('#')[1];
        const message: Message = {
          id,
          content: messageAdded,
          timestamp: new Date()
        };
        this.messages.update(msgs => [message, ...msgs]);

        // Record the message in stats
        this.statsService.recordMessage();

        this.updateMessageGroups();

        if (this.soundEnabled()) {
          this.notificationSound.play().catch(console.error);
        }

        this.toast.show({
          message: 'New message received',
          type: 'info'
        });
      },
      error: (err) => {
        console.error('Subscription error:', err);
        this.toast.show({
          message: 'Connection error: ' + err.message,
          type: 'error'
        });
      }
    });
  }

  disconnect(): void {
    this.gqlSse.disconnect();
    this.statsService.stopConnection();
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }
    this.toast.show({
      message: 'Disconnected from server',
      type: 'info'
    });
  }

  toggleSound(): void {
    this.soundEnabled.update(enabled => !enabled);
    this.toast.show({
      message: `Sound notifications ${this.soundEnabled() ? 'enabled' : 'disabled'}`,
      type: 'success'
    });
  }

  toggleTheme(): void {
    this.isDarkTheme.update(dark => !dark);
    localStorage.setItem('theme', this.isDarkTheme() ? 'dark' : 'light');
  }

  toggleAutoScroll(): void {
    this.autoScroll.update(auto => !auto);
    this.toast.show({
      message: `Auto-scroll ${this.autoScroll() ? 'enabled' : 'disabled'}`,
      type: 'info'
    });
  }

  clearMessages(): void {
    this.messages.set([]);
    this.toast.show({
      message: 'All messages cleared',
      type: 'success'
    });
  }

  filterMessages(): void {
    const search = this.searchTerm.toLowerCase();
    this.filteredMessages.set(
      search
        ? this.messages().filter(msg =>
            msg.content.toLowerCase().includes(search) ||
            msg.id.includes(search)
          )
        : this.messages()
    );
    this.updateMessageGroups();
  }

  async copyMessage(message: Message): Promise<void> {
    const text = `ID: ${message.id}\nTime: ${message.timestamp.toLocaleString()}\nContent: ${message.content}`;
    try {
      await navigator.clipboard.writeText(text);
      this.toast.show({
        message: 'Message copied to clipboard',
        type: 'success'
      });
    } catch (err) {
      console.error('Failed to copy message:', err);
      this.toast.show({
        message: 'Failed to copy message',
        type: 'error'
      });
    }
  }

  async exportMessages(): Promise<void> {
    const data = this.messages().map(m => ({
      id: m.id,
      content: m.content,
      timestamp: m.timestamp.toISOString()
    }));

    try {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `messages-${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      this.toast.show({
        message: 'Messages exported successfully',
        type: 'success'
      });
    } catch (err) {
      console.error('Failed to export messages:', err);
      this.toast.show({
        message: 'Failed to export messages',
        type: 'error'
      });
    }
  }

  private updateMessageGroups(): void {
    const messages = this.filteredMessages();
    const groups: MessageGroup[] = [];

    const now = new Date();
    const last5min = new Date(now.getTime() - 5 * 60000);
    const last15min = new Date(now.getTime() - 15 * 60000);
    const last30min = new Date(now.getTime() - 30 * 60000);

    groups.push({
      title: 'Last 5 minutes',
      messages: messages.filter(m => m.timestamp >= last5min)
    });

    groups.push({
      title: '5-15 minutes ago',
      messages: messages.filter(m => m.timestamp >= last15min && m.timestamp < last5min)
    });

    groups.push({
      title: '15-30 minutes ago',
      messages: messages.filter(m => m.timestamp >= last30min && m.timestamp < last15min)
    });

    groups.push({
      title: 'Earlier',
      messages: messages.filter(m => m.timestamp < last30min)
    });

    this.messageGroups.set(groups.filter(g => g.messages.length > 0));
  }

  private scrollToBottom(): void {
    const messageList = document.querySelector('.message-list');
    if (messageList) {
      messageList.scrollTop = messageList.scrollHeight;
    }
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
