import { ChangeDetectorRef, Component, OnDestroy, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSidenavModule } from '@angular/material/sidenav';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  map,
  Observable,
  Subject,
  takeUntil,
} from 'rxjs';
import { SearchControlsComponent } from '../search-controls/search-controls.component';
import { ProcedureListComponent } from '../procedure-list/procedure-list.component';
import { TilesMoreOptionComponent } from '../tiles-more-option/tiles-more-option.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { VideoDialogComponent } from '../shaka-player/video-dialog.component';

interface Project {
  id: number;
  name: string;
  date: Date;  // Only allow Date objects, not strings
  mediaType: string;
  mediaCount: number;
  procedure: string;
  progress: number;
  status: 'Active' | 'Inactive';
  showOptions: boolean;
  thumbnail: string;
  mediaUrl: string;
  thumbnails: string[];
  isPrivate: boolean;
  isActive: boolean;
  title: string;
  code: string;
  type: string;
  itemCount: number;
}

interface MediaItem {
  id: string;
  type: 'video' | 'image';
  title: string;
  thumbnail: string;
  url: string;
  date: string;
  progress?: number;
  status: 'active' | 'private' | 'deleted';
}

interface LibraryVersion {
  name: string;
  oldVersion?: string;
  newVersion: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    SearchControlsComponent,
    ProcedureListComponent,
    TilesMoreOptionComponent,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatListModule,
    CommonModule,
    TranslateModule,
    MatSidenavModule,
      ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnDestroy {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  menuItems = [
    { text: 'Dashboard', icon: 'dashboard', link: '/dashboard', position: 'start' },
    { text: 'Player', icon: 'play_circle', link: '/player', position: 'start' },
    { text: 'Profile', icon: 'person', link: '/profile', position: 'end' },
    { text: 'Settings', icon: 'settings', link: '/settings', position: 'end' },
  ];
  private readonly viewMode$ = new BehaviorSubject<'tiles' | 'thumbnails-large' | 'thumbnails-small'>('tiles');
  private readonly selectedItems$ = new BehaviorSubject<number[]>([]);
  private readonly selectedProcedure$ = new BehaviorSubject<Project | null>(null);
  public readonly procedures$ = new BehaviorSubject<Project[]>([]);
  private readonly showTilesMore$ = new BehaviorSubject<boolean>(false);
  private readonly destroy$ = new Subject<void>();
  translatedText!: string;
  viewModeObs$: Observable<'tiles' | 'thumbnails-large' | 'thumbnails-small'> = this.viewMode$.asObservable();
  selectedItemsObs$: Observable<number[]> = this.selectedItems$.asObservable();
  selectedProcedureObs$: Observable<Project | null> = this.selectedProcedure$.asObservable();
  showTilesMoreObs$: Observable<boolean> = this.showTilesMore$.asObservable();
  filteredProceduresObs$: Observable<Project[]> = this.procedures$.pipe(
    map((procedures) => procedures ?? [])
  );
  allSelectedPrivateObs$: Observable<boolean> = combineLatest([
    this.selectedItemsObs$,
    this.filteredProceduresObs$,
  ]).pipe(
    map(([selectedItems, procedures]) =>
      selectedItems.every((id) => {
        const procedure = procedures.find((p) => p.id === id);
        return procedure?.isPrivate ?? false;
      })
    )
  );

  mediaItems: MediaItem[] = [
    {
      id: '1',
      type: 'video',
      title: 'Sample DASH Video',
      thumbnail: 'assets/thumbnails/video1.jpg',
      url: 'https://dash.akamaized.net/envivio/EnvivioDash3/manifest.mpd',
      date: '2024-01-15',
      progress: 90,
      status: 'active',
    },
    // Add more items as needed
  ];

  libraryVersions: LibraryVersion[] = [
    { name: 'Angular-Material', oldVersion: '19.2.1', newVersion: '19.2.2' },
    { name: 'Ngx-translate', newVersion: '16.0.4' },
    { name: 'Tailwindcss/postcss', newVersion: '4.0.11' },
    { name: 'date-fns Library', newVersion: '4.1.0' },
    { name: 'Keylock', newVersion: '26.2.0' },
    { name: 'Shaka player', oldVersion: '4.13.6', newVersion: '4.14.14' },
    { name: 'RXJS', newVersion: '7.8.2' },
    { name: 'EsLint', newVersion: '9.21.0' },
    { name: 'Jose', newVersion: '6.0.11' }
  ];

  // Add property to track login status
  isLoggedIn: boolean = false; // Initialize to false

  constructor(
    private readonly sanitizer: DomSanitizer,
    private readonly cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // Simulate login status change after a delay (replace with actual auth logic)
    setTimeout(() => {
      this.isLoggedIn = true; // Set to true after simulating login
    }, 1000); // Adjust delay as needed

    this.translate
      .get('welcome_message', { name: 'John' })
      .subscribe((text: string) => {
        this.translatedText = text;
      });

    this.procedures$.next([
      {
        id: 1,
        name: 'Adam Garcia',
        date: new Date('2024-07-13'),
        type: 'Video',
        itemCount: 10,
        title: 'Storewide Satiable Swoop',
        code: 'OR619',
        progress: 90,
        isActive: true,
        isPrivate: false,
        thumbnail: 'https://img.youtube.com/vi/5qap5aO4i9A/0.jpg',
        mediaUrl: 'https://www.youtube.com/embed/5qap5aO4i9A',
        thumbnails: [
          'https://img.youtube.com/vi/5qap5aO4i9A/0.jpg',
          'https://img.youtube.com/vi/5qap5aO4i9A/1.jpg',
          'https://img.youtube.com/vi/5qap5aO4i9A/2.jpg',
        ],
        mediaType: 'Video',
        procedure: 'Storewide',
        status: 'Active',
        showOptions: false,
        mediaCount: 0,
      },
      {
        id: 2,
        name: 'Ashley Atkinson',
        date: new Date('2025-08-10'),
        type: 'Video',
        itemCount: 12,
        title: 'Thrift Cable Repica',
        code: 'OR646',
        progress: 75,
        isActive: false,
        isPrivate: false,
        thumbnail: 'https://img.youtube.com/vi/9bZkp7q19f0/0.jpg',
        mediaUrl: 'https://www.youtube.com/embed/9bZkp7q19f0',
        thumbnails: [
          'https://img.youtube.com/vi/9bZkp7q19f0/0.jpg',
          'https://img.youtube.com/vi/9bZkp7q19f0/1.jpg',
        ],
        mediaType: 'Video',
        procedure: 'Thrift',
        status: 'Inactive',
        showOptions: false,
        mediaCount: 0,
      },
      {
        id: 3,
        name: 'Brian Carter',
        date: new Date('2025-01-10'),
        type: 'Video',
        itemCount: 8,
        title: 'Inventory Sync Flow',
        code: 'OR723',
        progress: 60,
        isActive: true,
        isPrivate: true,
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg',
        mediaUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnails: [
          'https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg',
          'https://img.youtube.com/vi/dQw4w9WgXcQ/1.jpg',
          'https://img.youtube.com/vi/dQw4w9WgXcQ/2.jpg',
        ],
        mediaType: 'Video',
        procedure: 'Inventory',
        status: 'Active',
        showOptions: false,
        mediaCount: 0,
      },
      {        id: 4,
        name: 'Clara Donovan',
        date: new Date('2025-01-14'),
        type: 'Image',
        itemCount: 15,
        title: 'Warehouse Sorting Guide',
        code: 'OR801',
        progress: 45,
        isActive: false,
        isPrivate: false,
        thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
        mediaUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
        thumbnails: [
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?crop=entropy&fit=crop&h=150&w=200',
        ],
        mediaType: 'Image',
        procedure: 'Warehouse',
        status: 'Inactive',
        showOptions: false,
        mediaCount: 0,
      },
      {
        id: 5,
        name: 'David Evans',
        date: new Date('2022-03-18'),
        type: 'Video',
        itemCount: 5,
        title: 'Retail Audit Process',
        code: 'OR912',
        progress: 95,
        isActive: true,
        isPrivate: false,
        thumbnail: 'https://img.youtube.com/vi/3tmd-ClpJxA/0.jpg',
        mediaUrl: 'https://www.youtube.com/embed/3tmd-ClpJxA',
        thumbnails: [
          'https://img.youtube.com/vi/3tmd-ClpJxA/0.jpg',
          'https://img.youtube.com/vi/3tmd-ClpJxA/1.jpg',
          'https://img.youtube.com/vi/3tmd-ClpJxA/2.jpg',
        ],
        mediaType: 'Video',
        procedure: 'Retail',
        status: 'Active',
        showOptions: false,
        mediaCount: 0,
      },
      {
        id: 6,
        name: 'Frank Harrison',
        date: new Date('2024-06-04'),
        type: 'Video',
        itemCount: 7,
        title: 'DASH Streaming Demo',
        code: 'OR913',
        progress: 85,
        isActive: true,
        isPrivate: false,
        thumbnail: 'assets/thumbnails/dash-demo.jpg',
        mediaUrl: 'https://dash.akamaized.net/envivio/EnvivioDash3/manifest.mpd',
        thumbnails: [
          'assets/thumbnails/dash-demo.jpg',
          'assets/thumbnails/dash-demo-1.jpg',
          'assets/thumbnails/dash-demo-2.jpg',
        ],
        mediaType: 'Video',
        procedure: 'Streaming',
        status: 'Active',
        showOptions: false,
        mediaCount: 1,
      },
      {
        id: 7,
        name: 'Grace Wilson',
        date: new Date('2024-06-03'),
        type: 'Video',
        itemCount: 3,
        title: 'Big Buck Bunny DASH',
        code: 'OR914',
        progress: 70,
        isActive: true,
        isPrivate: false,
        thumbnail: 'assets/thumbnails/bunny.jpg',
        mediaUrl: 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd',
        thumbnails: [
          'assets/thumbnails/bunny.jpg',
          'assets/thumbnails/bunny-1.jpg',
          'assets/thumbnails/bunny-2.jpg',
        ],
        mediaType: 'Video',
        procedure: 'Streaming',
        status: 'Active',
        showOptions: false,
        mediaCount: 1,
      },
    ]);

    this.viewModeObs$
      .pipe(takeUntil(this.destroy$), debounceTime(100))
      .subscribe(() => this.selectedItems$.next([]));
  }

  onViewModeChange(
    viewMode: 'tiles' | 'thumbnails-large' | 'thumbnails-small'
  ): void {
    this.viewMode$.next(viewMode);
  }  onTileClick(procedure: Project): void {
    const procedures = this.procedures$.value;
    const currentIndex = procedures.findIndex(p => p.id === procedure.id);

    const commonData = {
      title: procedure.name,
      date: procedure.date,
      mediaType: procedure.mediaType,
      fileSize: procedure.type === 'Video' ? 'MP4, 74GB - 1920 x 1080' : 'Image',
      duration: procedure.type === 'Video' ? '1:35h' : undefined,
      author: procedure.name,
      notes: `Procedure ${procedure.code} - ${procedure.title}`,
      thumbnails: procedure.thumbnails,
      currentIndex,
      totalCount: procedures.length,
      onNext: () => {
        const nextIndex = (currentIndex + 1) % procedures.length;
        const nextProcedure = procedures[nextIndex];
        // Close current dialog and open next
        this.dialog.closeAll();
        setTimeout(() => this.onTileClick(nextProcedure), 100);
      },
      onPrevious: () => {
        const prevIndex = currentIndex - 1 < 0 ? procedures.length - 1 : currentIndex - 1;
        const prevProcedure = procedures[prevIndex];
        // Close current dialog and open previous
        this.dialog.closeAll();
        setTimeout(() => this.onTileClick(prevProcedure), 100);
      }
    };

    if (procedure.type === 'Video') {
      if (procedure.mediaUrl.endsWith('.mpd')) {
        // Open DASH videos in the Shaka player dialog
        this.dialog.open(VideoDialogComponent, {
          width: '90vw',
          height: '90vh',
          maxWidth: '1800px',
          maxHeight: '1000px',
          panelClass: 'video-dialog',
          data: {
            ...commonData,
            manifestUrl: procedure.mediaUrl
          }
        });
      } else if (procedure.mediaUrl.includes('youtube.com/embed/')) {
        // Handle YouTube videos
        this.dialog.open(VideoDialogComponent, {
          width: '90vw',
          height: '90vh',
          maxWidth: '1800px',
          maxHeight: '1000px',
          panelClass: 'video-dialog',
          data: {
            ...commonData,
            youtubeUrl: procedure.mediaUrl
          }
        });
      }    } else if (procedure.type === 'Image') {
      // Handle images
      this.dialog.open(VideoDialogComponent, {
        width: '90vw',
        height: '90vh',
        maxWidth: '1800px',
        maxHeight: '1000px',
        panelClass: 'image-dialog',
        data: {
          ...commonData,
          imageUrl: procedure.mediaUrl
        }
      });
    }
  }
  onThumbnailClick(thumb: string, procedure: Project): void {
    if (procedure.type === 'Video') {
      // For videos, re-open the video dialog with the selected thumbnail index
      const thumbIndex = procedure.thumbnails.indexOf(thumb);
      if (thumbIndex !== -1) {
        this.onTileClick(procedure);
      }
    } else {
      // For images, update the displayed image
      const updatedProcedure = { ...procedure, mediaUrl: thumb };
      this.selectedProcedure$.next(updatedProcedure);
    }
  }

  closeGallery(): void {
    this.selectedProcedure$.next(null);
  }

  togglePrivate(procedure: Project): void {
    const procedures = this.procedures$.value;
    const updatedProcedure = { ...procedure, isPrivate: !procedure.isPrivate };
    const updatedProcedures = procedures.map((p) =>
      p.id === procedure.id ? updatedProcedure : p
    );
    this.procedures$.next(updatedProcedures);
  }

  toggleSelection(id: number): void {
    const currentSelection = this.selectedItems$.value;
    const newSelection = currentSelection.includes(id)
      ? currentSelection.filter((item) => item !== id)
      : [...currentSelection, id];
    this.selectedItems$.next(newSelection);
    this.cdr.detectChanges();
  }

  togglePrivateForSelected(): void {
    const allPrivate = this.selectedItems$.value.every((id) => {
      const procedure = this.procedures$.value.find((p) => p.id === id);
      return procedure?.isPrivate ?? false;
    });

    const procedures = this.procedures$.value;
    const updatedProcedures = procedures.map((procedure) => {
      if (this.selectedItems$.value.includes(procedure.id)) {
        return { ...procedure, isPrivate: !allPrivate };
      }
      return procedure;
    });
    this.procedures$.next(updatedProcedures);
  }

  clearSelection(): void {
    this.selectedItems$.next([]);
  }

  onAddTile(tile: Project): void {
    const procedures = this.procedures$.value;
    if (!procedures.some((p) => p.id === tile.id)) {
      this.procedures$.next([...procedures, tile]);
      this.cdr.detectChanges();
    }
  }

  onRemoveTile(id: number): void {
    const procedures = this.procedures$.value;
    this.procedures$.next(procedures.filter((p) => p.id !== id));
    this.cdr.detectChanges();
  }

  toggleTilesMore(): void {
    this.showTilesMore$.next(!this.showTilesMore$.value);
  }

  safeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  openMedia(item: MediaItem) {
    console.log("Inside :"+ item);
    if (item.type === 'video') {
      console.log("Inside :"+ item);
      this.dialog.open(VideoDialogComponent, {
        width: '1024px',
        height: '600px',
        panelClass: 'video-dialog',
        data: { manifestUrl: item.url, title: item.title },
      });
    } else {
      // Handle image display
      this.dialog.open(VideoDialogComponent, {
        width: '800px',
        height: 'auto',
        panelClass: 'image-dialog',
        data: { imageUrl: item.url, title: item.title },
      });
    }
  }

  getVersionInfo(libraryName: string): LibraryVersion | undefined {
    return this.libraryVersions.find(lib => lib.name === libraryName);
  }

  hasVersionUpdate(library: LibraryVersion): boolean {
    return !!library.oldVersion && library.oldVersion !== library.newVersion;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
