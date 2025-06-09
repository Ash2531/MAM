import { Component, Inject, ViewChild, ElementRef, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SafeUrlPipe } from '../shared/pipes/safe-url.pipe';
import { VideoControlsComponent } from './video-controls.component';

interface DialogData {
  title: string;
  date: Date | string;
  mediaType: string;
  fileSize: string;
  duration?: string;
  author: string;
  notes: string;
  thumbnails?: string[];
  manifestUrl?: string;
  youtubeUrl?: string;
  imageUrl?: string;
  currentIndex?: number;
  totalCount?: number;
  onNext?: () => void;
  onPrevious?: () => void;
}

@Component({
  selector: 'app-video-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, SafeUrlPipe, VideoControlsComponent],
  template: `
    <div class="dialog-container">
      <div class="info-panel">
        <button mat-icon-button class="close-button" (click)="dialogRef.close()">
          <mat-icon>close</mat-icon>
        </button>

        <div class="media-header">
          <h2 class="media-title">{{data.title}}</h2>
          <div class="media-counter" *ngIf="data.currentIndex !== undefined && data.totalCount">
            {{data.currentIndex + 1}} / {{data.totalCount}}
          </div>
        </div>

        <div class="info-section">
          <h3 class="section-title">MEDIA INFORMATION</h3>
          <div class="info-grid">
            <div class="info-row">
              <span class="label">Date</span>
              <span class="value">{{formatDate(data.date)}}</span>
            </div>
            <div class="info-row">
              <span class="label">Format</span>
              <span class="value">{{data.mediaType}}</span>
            </div>
            <div class="info-row">
              <span class="label">Resolution</span>
              <span class="value">{{data.fileSize}}</span>
            </div>
            <div class="info-row">
              <span class="label">Duration</span>
              <span class="value">{{data.duration || 'N/A'}}</span>
            </div>
          </div>
        </div>

        <div class="info-section">
          <h3 class="section-title">PROCEDURE NOTES</h3>
          <p class="procedure-notes">{{data.notes || 'No notes available'}}</p>
        </div>

        <ng-container *ngIf="data.thumbnails as thumbnails">
          <div class="thumbnail-section" *ngIf="thumbnails.length > 0">
            <div class="thumbnails-header">
              <h3 class="section-title">NAVIGATION</h3>
              <div class="thumbnail-counter">
                {{currentThumbnailIndex + 1}}/{{thumbnails.length}}
              </div>
            </div>
            <div class="thumbnails-grid">
              <div *ngFor="let thumb of thumbnails; let i = index"
                   class="thumbnail-item"
                   [class.active]="currentThumbnailIndex === i"
                   (click)="onThumbnailClick(i)">
                <img [src]="thumb" [alt]="'Frame ' + (i + 1)">
                <span class="thumbnail-number">{{i + 1}}</span>
              </div>
            </div>
          </div>
        </ng-container>
      </div>

      <div class="media-content">
        <div class="video-container">
          <ng-container *ngIf="data.manifestUrl">
            <div class="video-player-container">
              <video #videoElement class="video-player"></video>
              <app-video-controls [videoElement]="videoElement"></app-video-controls>
              <div *ngIf="isLoading" class="loading-overlay">
                <mat-spinner diameter="48"></mat-spinner>
              </div>
            </div>
          </ng-container>
          <ng-container *ngIf="data.youtubeUrl">
            <iframe
              [src]="data.youtubeUrl | safeUrl"
              class="video-player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </ng-container>
          <ng-container *ngIf="data.imageUrl">
            <img
              [src]="data.imageUrl"
              [alt]="data.title"
              class="image-view"
            />
          </ng-container>
        </div>

        <ng-container *ngIf="data.thumbnails as thumbnails">
          <div class="navigation-controls" *ngIf="thumbnails.length > 1">
            <button class="nav-button prev" (click)="onNavigationClick('prev')">
              <mat-icon>chevron_left</mat-icon>
            </button>
            <button class="nav-button next" (click)="onNavigationClick('next')">
              <mat-icon>chevron_right</mat-icon>
            </button>
          </div>
        </ng-container>
      </div>
    </div>
  `,
  styles: [`
    .dialog-container {
      display: flex;
      flex-direction: row-reverse;
      width: 100%;
      height: 100%;
      background: #1a1a1a;
      overflow: hidden;
    }

    .media-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      position: relative;
      background: #000;
    }

    .video-container {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .video-player-container {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #000;
    }

    .video-player {
      width: 100%;
      height: 100%;
      object-fit: contain;
      background: #000;
      max-height: calc(100vh - 48px);
      aspect-ratio: 16/9;
      margin: auto;
    }

    app-video-controls {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 10;
    }

    .image-view {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }

    .info-panel {
      width: 300px;
      height: 100%;
      background: #242424;
      padding: 24px;
      overflow-y: auto;
      flex-shrink: 0;
      border-left: 1px solid rgba(255, 255, 255, 0.1);
    }

    .close-button {
      position: absolute;
      top: 16px;
      right: 16px;
      background: none;
      border: none;
      color: #fff;
      cursor: pointer;
      padding: 4px;

      &:hover {
        color: #ddd;
      }

      mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }
    }

    .media-header {
      margin-bottom: 24px;
      padding-right: 32px;
    }

    .media-title {
      font-size: 20px;
      font-weight: 500;
      color: #fff;
      margin: 0 0 8px;
    }

    .media-counter {
      font-size: 14px;
      color: #888;
    }

    .info-section {
      margin-bottom: 24px;
    }

    .section-title {
      font-size: 12px;
      text-transform: uppercase;
      color: #888;
      letter-spacing: 1px;
      margin: 0 0 16px;
    }

    .info-grid {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .info-row {
      display: flex;
      justify-content: space-between;

      .label {
        color: #888;
        font-size: 14px;
      }

      .value {
        color: #fff;
        font-size: 14px;
      }
    }

    .procedure-notes {
      color: #fff;
      font-size: 14px;
      line-height: 1.5;
    }

    .thumbnail-section {
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding-top: 24px;
    }

    .thumbnails-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .thumbnail-counter {
      font-size: 14px;
      color: #888;
    }

    .thumbnails-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
    }

    .thumbnail-item {
      position: relative;
      aspect-ratio: 16/9;
      cursor: pointer;
      border-radius: 4px;
      overflow: hidden;
      border: 2px solid transparent;

      &.active {
        border-color: #3b82f6;
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .thumbnail-number {
        position: absolute;
        top: 4px;
        left: 4px;
        background: rgba(0, 0, 0, 0.75);
        color: white;
        font-size: 12px;
        padding: 2px 6px;
        border-radius: 4px;
      }
    }

    .navigation-controls {
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      transform: translateY(-50%);
      display: flex;
      justify-content: space-between;
      padding: 0 16px;
      pointer-events: none;
    }

    .nav-button {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.5);
      border: none;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      pointer-events: auto;
      transition: background-color 0.2s;

      &:hover {
        background: rgba(0, 0, 0, 0.75);
      }

      &.prev {
        margin-right: auto;
      }

      &.next {
        margin-left: auto;
      }
    }

    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.7);
      z-index: 20;
    }

    ::ng-deep .mat-mdc-dialog-container {
      padding: 0 !important;
    }
  `]
})
export class VideoDialogComponent implements AfterViewInit, OnDestroy {    @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
    private player: any = null;
    currentThumbnailIndex = 0;
    isLoading = true;

  constructor(
    public dialogRef: MatDialogRef<VideoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private cdr: ChangeDetectorRef
  ) {
    // Ensure shaka.js is loaded
    if (!(window as any).shaka) {
      console.error('Shaka player not loaded. Please check if shaka-player.compiled.js is included in the page.');
    }
  }

  ngAfterViewInit() {
    if (this.data.manifestUrl && this.videoElement) {
      // Initialize player after a short delay to ensure DOM is ready
      setTimeout(() => {
        this.initializeShakaPlayer().catch(err => {
          console.error('Failed to initialize player:', err);
          this.isLoading = false;
          this.cdr.detectChanges();
        });
      }, 100);
    }
  }

  onThumbnailClick(index: number) {
    this.currentThumbnailIndex = index;
    if (this.data.onNext && this.data.onPrevious) {
      // Update view to match navigation when thumbnail is clicked
      this.data.currentIndex = index;
      this.cdr.detectChanges();
    }
  }

  onNavigationClick(direction: 'next' | 'prev') {
    if (direction === 'next' && this.data.onNext) {
      this.data.onNext();
      this.currentThumbnailIndex = (this.currentThumbnailIndex + 1) % (this.data.thumbnails?.length || 1);
    } else if (direction === 'prev' && this.data.onPrevious) {
      this.data.onPrevious();
      this.currentThumbnailIndex = this.currentThumbnailIndex === 0 ?
        (this.data.thumbnails?.length || 1) - 1 :
        this.currentThumbnailIndex - 1;
    }
    this.cdr.detectChanges();
  }

  private async initializeShakaPlayer() {
    try {
      this.isLoading = true;
      const shaka = (window as any).shaka;

      if (!shaka) {
        throw new Error('Shaka player not loaded');
      }

      // Check browser support
      if (!shaka.Player.isBrowserSupported()) {
        throw new Error('Browser not supported for DASH playback');
      }

      // Install polyfills
      shaka.polyfill.installAll();

      // Create player
      this.player = new shaka.Player(this.videoElement.nativeElement);

      // Add error handler
      this.player.addEventListener('error', this.onErrorEvent.bind(this));

      // Configure player
      this.player.configure({
        streaming: {
          bufferingGoal: 30,
          rebufferingGoal: 2,
          bufferBehind: 30
        }
      });

      // Load the manifest
      console.log('Loading manifest:', this.data.manifestUrl);
      await this.player.load(this.data.manifestUrl);

      // Add video event listeners
      this.videoElement.nativeElement.addEventListener('loadedmetadata', () => {
        console.log('Video metadata loaded');
        this.isLoading = false;
        this.cdr.detectChanges();
      });

      this.videoElement.nativeElement.addEventListener('error', (e) => {
        console.error('Video element error:', e);
        this.isLoading = false;
        this.cdr.detectChanges();
      });

      // Start playback automatically
      await this.videoElement.nativeElement.play();
      console.log('Video loaded successfully');
    } catch (error) {
      console.error('Error initializing Shaka Player:', error);
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  private onErrorEvent(event: any) {
    console.error('Error event:', event);
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  ngOnDestroy() {
    if (this.player) {
      this.player.destroy();
    }
  }
}
