import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { GraphqlSseService } from '../services/graphql-sse.service';
import { EventData, StreamData } from '../types/graphql.types';
import { ManualEventDialogComponent } from '../manual-event-dialog/manual-event-dialog.component';

@Component({
  selector: 'app-graphql-demo',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    MatDialogModule
  ],
  template: `
    <div class="demo-container">
      <h1 class="bold">GraphQL SSE Demo</h1>

      <div class="status-section">
        <mat-card>
          <mat-card-header>
            <mat-icon mat-card-avatar [class.connected]="sseService.connectionStatus() === 'connected'"
                     [class.disconnected]="sseService.connectionStatus() === 'disconnected'"
                     [class.connecting]="sseService.connectionStatus() === 'connecting'">
              {{ getStatusIcon() }}
            </mat-icon>
            <mat-card-title>Connection Status</mat-card-title>
            <mat-card-subtitle>{{ sseService.connectionStatus() | titlecase }}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-actions>
            <button mat-raised-button color="primary" (click)="toggleConnection()">
              {{ sseService.connectionStatus() === 'connected' ? 'Disconnect' : 'Connect' }}
            </button>
            <button mat-raised-button color="warn" (click)="clearEvents()">
              Clear Events
            </button>
            <button mat-raised-button color="accent" (click)="createTestEvent()">
              Create Test Event
            </button>
            <button mat-raised-button color="accent" (click)="updateStreamStatus()">
              Update Stream Status
            </button>
            <button mat-raised-button color="basic" (click)="openManualEventDialog()">
              Open Manual Event Dialog
            </button>
          </mat-card-actions>
        </mat-card>
      </div>

      <div class="content-grid">
        <mat-card class="stream-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>play_circle</mat-icon>
            <mat-card-title>Stream Data</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div *ngIf="sseService.streamData() as stream" class="stream-info beautiful-stream-info">
              <div class="stream-header">
                <mat-icon class="stream-icon h-[33px] w-[33px]" color="primary">play_circle</mat-icon>
                <span class="stream-title">Stream Details</span>
              </div>
              <div class="stream-details-grid">
                <div class="stream-detail"><span class="label">ID:</span> <span class="value">{{ stream.id }}</span></div>
                <div class="stream-detail"><span class="label">Type:</span> <span class="value">{{ stream.type }}</span></div>
                <div class="stream-detail"><span class="label">Quality:</span> <span class="value">{{ stream.quality }}</span></div>
                <div class="stream-detail"><span class="label">Status:</span>
                  <mat-chip [color]="stream.status === 'ACTIVE' ? 'primary' : 'warn'" selected>
                    {{ stream.status }}
                  </mat-chip>
                </div>
                <div class="stream-detail url-row"><span class="label">URL:</span> <span class="value url-value">{{ stream.url }}</span></div>
              </div>
            </div>
            <div *ngIf="!sseService.streamData()" class="no-data">
              No stream data available
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="events-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>notifications</mat-icon>
            <mat-card-title>Event Log</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <mat-list>
              <mat-list-item *ngFor="let event of eventDataList; let i = index" [class.highlighted]="i === 0" [class]="event.type.toLowerCase()">
                <mat-icon matListItemIcon>{{ getEventIcon(event.type) }}</mat-icon>
                <div matListItemTitle>{{ event.message }}</div>
                <div matListItemLine>{{ event.timestamp | date:'medium' }}</div>
              </mat-list-item>
            </mat-list>
            <div *ngIf="!eventDataList || eventDataList.length === 0" class="no-data">
              No events received yet
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .demo-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .status-section {
      margin-bottom: 20px;
    }
    .content-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
      gap: 20px;
      align-items: stretch;
    }
    .stream-card, .events-card {
      display: flex;
      flex-direction: column;
      height: 500px;
      min-height: 340px;
      max-height: 70vh;
    }
    .events-card mat-card-content {
      flex: 1 1 auto;
      overflow-y: auto;
      min-height: 0;
    }
    .stream-card mat-card-content {
      flex: 1 1 auto;
      min-height: 0;
    }
    .no-data {
      padding: 16px;
      text-align: center;
      color: #666;
    }
    mat-icon {
      &.connected { color: #4caf50; }
      &.disconnected { color: #f44336; }
      &.connecting { color: #ff9800; }
    }
    .mat-list-item {
      &.info { border-left: 4px solid #2196f3; }
      &.warning { border-left: 4px solid #ff9800; }
      &.error { border-left: 4px solid #f44336; }
    }
    h1 {
      text-align: center;
      margin-bottom: 30px;
      color: #333;
    }

    /* Fix for Material form field width within flex container */
    .create-event-form mat-form-field {
      width: 100%; /* Ensure form field takes full width */
    }

    .create-event-form .mat-form-field-wrapper {
      width: 100%; /* Ensure the wrapper also takes full width */
    }

    .create-event-form .mat-form-field-flex {
      width: 100%; /* Ensure the flex container inside takes full width */
    }

    .beautiful-stream-info {
      background: #f8fafc;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      padding: 24px 20px 20px 20px;
      margin-bottom: 8px;
      transition: box-shadow 0.2s;
    }
    .beautiful-stream-info:hover {
      box-shadow: 0 4px 16px rgba(0,0,0,0.08);
    }
    .stream-header {
      display: flex;
      align-items: center;
      margin-bottom: 18px;
    }
    .stream-icon {
      font-size: 32px;
      margin-right: 10px;
    }
    .stream-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #2563eb;
    }
    .stream-details-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px 32px;
    }
    .stream-detail {
      font-size: 1rem;
      display: flex;
      align-items: center;
    }
    .label {
      font-weight: 500;
      color: #64748b;
      min-width: 70px;
      margin-right: 6px;
    }
    .value {
      color: #0f172a;
      font-weight: 400;
    }
    .url-row {
      grid-column: 1 / -1;
      word-break: break-all;
    }
    .url-value {
      color: #0369a1;
      font-family: monospace;
      font-size: 0.98rem;
    }
    .highlighted {
      background-color: #e1f5fe; /* Light blue background for highlighted event */
      border-left: 4px solid #039be5; /* Blue left border for emphasis */
    }
  `]
})
export class GraphqlDemoComponent implements OnInit, OnDestroy {
  constructor(public sseService: GraphqlSseService, public dialog: MatDialog) {}

  get eventDataList() {
    const data = this.sseService.eventData();
    // Defensive: ensure it's always an array and sort by timestamp descending
    return Array.isArray(data) ? data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) : [];
  }

  ngOnInit(): void {
    // Component initialization
  }

  ngOnDestroy(): void {
    // Clean up when component is destroyed
    this.sseService.disconnect();
  }

  toggleConnection(): void {
    if (this.sseService.connectionStatus() === 'connected') {
      this.sseService.disconnect();
    } else {
      this.sseService.connect(); // Explicitly reconnect
      this.sseService.clearEventData();
    }
  }

  clearEvents(): void {
    this.sseService.clearEventData();
  }

  createTestEvent(): void {
    this.sseService.createTestEvent();
  }

  updateStreamStatus(): void {
    this.sseService.updateStreamStatus();
  }

  openManualEventDialog(): void {
    const dialogRef = this.dialog.open(ManualEventDialogComponent, {
      width: '400px', // Adjust width as needed
      data: { type: 'INFO', message: '' } // Pass initial data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // If the dialog was closed with data (i.e., Create button was clicked)
        this.sseService.createManualEvent(result.type, result.message);
      }
    });
  }

  getStatusIcon(): string {
    switch (this.sseService.connectionStatus()) {
      case 'connected': return 'wifi';
      case 'disconnected': return 'wifi_off';
      case 'connecting': return 'sync';
      default: return 'help';
    }
  }

  getEventIcon(type: string): string {
    switch (type) {
      case 'INFO': return 'info';
      case 'WARNING': return 'warning';
      case 'ERROR': return 'error';
      default: return 'notifications';
    }
  }
}
