import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface DialogData {
  type: string;
  message: string;
}

@Component({
  selector: 'app-manual-event-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title class="dialog-title">
      <mat-icon class="mr-2">event_note</mat-icon>
      Stream Data / Event Log
    </h2>
    <mat-dialog-content>
      <div class="create-event-form">
        <div class="mb-4 text-gray-600 text-sm flex items-center">
          <mat-icon class="mr-1" color="primary">info</mat-icon>
          Create a new event log entry for your data stream. Choose the type and provide a message.
        </div>
        <mat-form-field class="w-full">
          <mat-label>Event Type</mat-label>
          <mat-select [(ngModel)]="data.type">
            <mat-option value="INFO">
              <mat-icon class="mr-1" color="primary">info</mat-icon>Info
            </mat-option>
            <mat-option value="WARNING">
              <mat-icon class="mr-1" color="warn">warning</mat-icon>Warning
            </mat-option>
            <mat-option value="ERROR">
              <mat-icon class="mr-1" color="accent">error</mat-icon>Error
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field class="w-full mt-4">
          <mat-label>Event Message</mat-label>
          <textarea matInput [(ngModel)]="data.message" placeholder="Describe the event..." rows="3"></textarea>
          <mat-hint align="end">{{data.message.length || 0}} / 250</mat-hint>
        </mat-form-field>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-stroked-button color="basic" (click)="dialogRef.close()">
        <mat-icon>close</mat-icon> Cancel
      </button>
      <button mat-raised-button color="primary" (click)="dialogRef.close(data)" [disabled]="!data.message || data.message.length > 250">
        <mat-icon>add_circle</mat-icon> Create
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-title {
      display: flex;
      align-items: center;
      font-weight: 600;
      font-size: 1.3rem;
      margin-bottom: 8px;
    }
    .create-event-form {
      min-width: 340px;
      padding: 20px 0 8px 0;
    }
    .mat-form-field {
      width: 100%;
    }
    .mb-4 {
      margin-bottom: 1rem;
    }
    .mr-1 {
      margin-right: 0.25rem;
    }
    .mr-2 {
      margin-right: 0.5rem;
    }
    textarea[matInput] {
      resize: vertical;
    }
  `]
})
export class ManualEventDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ManualEventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}
}
