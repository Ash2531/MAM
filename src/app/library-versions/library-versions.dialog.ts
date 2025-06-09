import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { PackageService, LibraryVersion } from '../services/package.service';

@Component({
  selector: 'app-library-versions',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title class="flex justify-between items-center">
      <span>Libraries Used</span>
      <button mat-icon-button (click)="refreshVersions()" [disabled]="loading">
        <mat-icon>refresh</mat-icon>
      </button>
    </h2>
    <mat-dialog-content>
      <div *ngIf="loading" class="flex justify-center items-center p-4">
        <mat-spinner diameter="40"></mat-spinner>
      </div>
      <table *ngIf="!loading" class="min-w-full">
        <thead>
          <tr>
            <th class="text-left p-2">Library Name</th>
            <th class="text-left p-2">Current Version</th>
            <th class="text-left p-2">Latest Version</th>
            <th class="text-left p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let lib of libraries" [class.bg-green-50]="lib.hasUpdate">
            <td class="p-2">{{lib.name}}</td>
            <td class="p-2">{{lib.oldVersion || '-'}}</td>
            <td class="p-2">{{lib.newVersion}}</td>
            <td class="p-2">
              <span *ngIf="lib.hasUpdate" class="text-green-600 font-medium">
                Update Available
              </span>
              <span *ngIf="!lib.hasUpdate && lib.newVersion !== 'unknown'" class="text-gray-600">
                Up to date
              </span>
              <span *ngIf="lib.newVersion === 'unknown'" class="text-gray-400">
                Unknown
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `
})
export class LibraryVersionsDialog implements OnInit {
  libraries: LibraryVersion[] = [];
  loading = true;

  constructor(
    public dialogRef: MatDialogRef<LibraryVersionsDialog>,
    private packageService: PackageService
  ) {}

  ngOnInit() {
    this.loadVersions();
  }

  loadVersions() {
    this.loading = true;
    this.packageService.getLibraryVersions().subscribe({
      next: (versions) => {
        this.libraries = versions;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading library versions:', error);
        this.loading = false;
      }
    });
  }

  refreshVersions() {
    this.loadVersions();
  }
}
