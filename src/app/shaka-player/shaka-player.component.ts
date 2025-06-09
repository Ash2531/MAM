import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { VideoDialogComponent } from './video-dialog.component';

declare global {
  interface Window {
    shaka: any;
  }
}

@Component({
  selector: 'app-shaka-player',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule
  ],
  template: `
    <div class="p-6">
      <div class="mb-6 flex items-center gap-2">
        <mat-form-field class="flex-1">
          <mat-label>Stream URL</mat-label>
          <input matInput [(ngModel)]="manifestUrl" placeholder="Enter DASH/HLS URL">
        </mat-form-field>
        <button mat-raised-button color="primary" (click)="loadManifest()">Load</button>
        <button mat-raised-button color="accent" (click)="openInDialog()">Play in Popup</button>
      </div>

      <video
        #videoElement
        class="w-[80%] aspect-video bg-black"
        controls
      ></video>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 80%;
    }
  `]
})
export class ShakaPlayerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  private player: any = null;
  manifestUrl = 'https://dash.akamaized.net/envivio/EnvivioDash3/manifest.mpd';

  constructor(private dialog: MatDialog) {}

  private loadShakaPlayer(): Promise<void> {
    return new Promise((resolve) => {
      if (window.shaka) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.type = 'application/javascript';  // Add proper MIME type
      console.log("Loading local Shaka player script");
      script.src = 'assets/shaka-player/shaka-player.compiled.js';
      script.onload = () => resolve();
      script.onerror = (e) => console.error('Error loading Shaka Player:', e);
      document.head.appendChild(script);
    });
  }

  async ngAfterViewInit() {
    try {
      await this.loadShakaPlayer();

      if (window.shaka) {
        // Install built-in polyfills to patch browser incompatibilities
        window.shaka.polyfill.installAll();

        // Create a Player instance
        this.player = new window.shaka.Player(this.videoElement.nativeElement);

        // Listen for error events
        this.player.addEventListener('error', (event: any) => {
          console.error('Error code', event.detail.code, 'object', event.detail);
        });

        // Try to load the manifest
        await this.loadManifest();
      }
    } catch (error) {
      console.error('Error loading player:', error);
    }
  }

  async loadManifest() {
    if (!this.player || !this.manifestUrl) return;

    try {
      await this.player.load(this.manifestUrl);
      console.log('The video has been loaded');
    } catch (error) {
      console.error('Error loading manifest:', error);
    }
  }

  openInDialog() {
    const dialogRef = this.dialog.open(VideoDialogComponent, {
      width: '1024px',
      height: '600px',
      maxWidth: '95vw',
      maxHeight: '95vh',
      panelClass: 'video-dialog',
      disableClose: false,
      autoFocus: false,
      data: { manifestUrl: this.manifestUrl }
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('Dialog closed');
    });
  }

  ngOnDestroy() {
    if (this.player) {
      this.player.destroy();
      this.player = null;
    }
  }
}
