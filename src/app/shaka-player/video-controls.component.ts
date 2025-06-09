import { Component, Input, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-video-controls',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatSliderModule, FormsModule],
  template: `
    <div class="video-controls-container">
      <div class="video-controls">
        <div class="timeline">
          <mat-slider
            class="w-full"
            [min]="0"
            [max]="duration"
            discrete>
            <input
              matSliderThumb
              [ngModel]="currentTime"
              (ngModelChange)="onTimeUpdate($event)">
          </mat-slider>
        </div>
        <div class="controls-bar">
          <div class="left-controls">
            <button mat-icon-button (click)="togglePlay()">
              <mat-icon>{{ isPlaying ? 'pause' : 'play_arrow' }}</mat-icon>
            </button>
            <button mat-icon-button (click)="toggleMute()">
              <mat-icon>{{ isMuted ? 'volume_off' : 'volume_up' }}</mat-icon>
            </button>
            <div class="volume-control">
              <mat-slider
                [min]="0"
                [max]="100"
                discrete>
                <input
                  matSliderThumb
                  [ngModel]="volume"
                  (ngModelChange)="onVolumeChange($event)">
              </mat-slider>
            </div>
            <span class="time-display">
              {{formatTime(currentTime)}} / {{formatTime(duration)}}
            </span>
          </div>
          <div class="right-controls">
            <button mat-icon-button (click)="toggleFullscreen()">
              <mat-icon>{{ isFullscreen ? 'fullscreen_exit' : 'fullscreen' }}</mat-icon>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      position: relative;
      display: block;
      width: 100%;
    }

    .video-controls-container {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0));
      padding: 16px;
      opacity: 0;
      transition: opacity 0.3s;

      &:hover {
        opacity: 1;
      }
    }

    .video-controls {
      color: white;
    }

    .timeline {
      width: 100%;
      padding: 0 16px;
    }

    .controls-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 16px;
    }

    .left-controls, .right-controls {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .volume-control {
      display: flex;
      align-items: center;
      width: 100px;
    }

    .time-display {
      color: white;
      font-size: 14px;
      margin-left: 16px;
    }

    ::ng-deep {
      .mat-mdc-slider {
        --mdc-slider-handle-color: #f00;
        --mdc-slider-focus-handle-color: #f00;
        --mdc-slider-hover-handle-color: #f00;
        --mdc-slider-active-track-color: #f00;
        --mdc-slider-inactive-track-color: rgba(255,255,255,0.3);
      }

      .mat-mdc-icon-button {
        color: white;
      }
    }
  `]
})
export class VideoControlsComponent implements AfterViewInit, OnDestroy {
  @Input() videoElement!: HTMLVideoElement;

  isPlaying = false;
  isMuted = false;
  isFullscreen = false;
  volume = 100;
  currentTime = 0;
  duration = 0;

  private video!: HTMLVideoElement;

  private timeUpdateHandler = () => {
    this.currentTime = this.video.currentTime;
    this.cdr.detectChanges();
  };

  private metadataLoadHandler = () => {
    this.duration = this.video.duration;
    this.cdr.detectChanges();
  };

  private playHandler = () => {
    this.isPlaying = true;
    this.cdr.detectChanges();
  };

  private pauseHandler = () => {
    this.isPlaying = false;
    this.cdr.detectChanges();
  };

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.video = this.videoElement;
    this.setupEventListeners();
    this.cdr.detectChanges();
  }

  private setupEventListeners() {
    this.video.addEventListener('timeupdate', this.timeUpdateHandler);
    this.video.addEventListener('loadedmetadata', this.metadataLoadHandler);
    this.video.addEventListener('play', this.playHandler);
    this.video.addEventListener('pause', this.pauseHandler);
  }

  togglePlay() {
    if (this.video.paused) {
      this.video.play();
    } else {
      this.video.pause();
    }
  }

  toggleMute() {
    this.video.muted = !this.video.muted;
    this.isMuted = this.video.muted;
  }

  onVolumeChange(value: number) {
    this.volume = value;
    if (this.video) {
      this.video.volume = this.volume / 100;
    }
    this.cdr.detectChanges();
  }

  onTimeUpdate(value: number) {
    if (this.video) {
      this.video.currentTime = value;
    }
    this.cdr.detectChanges();
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      this.video.requestFullscreen();
      this.isFullscreen = true;
    } else {
      document.exitFullscreen();
      this.isFullscreen = false;
    }
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  ngOnDestroy() {
    if (this.video) {
      this.video.removeEventListener('timeupdate', this.timeUpdateHandler);
      this.video.removeEventListener('loadedmetadata', this.metadataLoadHandler);
      this.video.removeEventListener('play', this.playHandler);
      this.video.removeEventListener('pause', this.pauseHandler);
    }
  }
}
