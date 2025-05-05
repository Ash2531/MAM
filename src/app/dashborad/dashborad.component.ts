import { Component, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject, combineLatest, debounceTime, map, Observable, Subject, takeUntil } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface Project {
  id: number;
  name: string;
  date: Date;
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

@Component({
  selector: 'app-dashborad',
  templateUrl: './dashborad.component.html',
  styleUrls: ['./dashborad.component.scss'],
})
export class DashboradComponent implements OnDestroy {
  private viewMode$ = new BehaviorSubject<'tiles' | 'thumbnails-large' | 'thumbnails-small'>('tiles');
  private selectedItems$ = new BehaviorSubject<number[]>([]);
  private selectedProcedure$ = new BehaviorSubject<Project | null>(null);
  private procedures$ = new BehaviorSubject<Project[]>([]);
  private destroy$ = new Subject<void>();
  showTilesMore: boolean = false; // Toggle for Tiles More view

  // Public observables for template
  viewModeObs$: Observable<'tiles' | 'thumbnails-large' | 'thumbnails-small'> = this.viewMode$.asObservable();
  selectedItemsObs$: Observable<number[]> = this.selectedItems$.asObservable();
  selectedProcedureObs$: Observable<Project | null> = this.selectedProcedure$.asObservable();
  filteredProceduresObs$: Observable<Project[]> = this.procedures$.pipe(
    map(procedures => procedures ?? [])
  );

  allSelectedPrivateObs$: Observable<boolean> = combineLatest([this.selectedItemsObs$, this.filteredProceduresObs$]).pipe(
    map(([selectedItems, procedures]) =>
      selectedItems.every(id => {
        const procedure = procedures.find(p => p.id === id);
        return procedure?.isPrivate ?? false;
      })
    )
  );

  constructor(
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Initialize procedures
    this.procedures$.next([
      {
        id: 1,
        name: 'Adam Garcia',
        date: new Date('2025-03-25'),
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
        date: new Date('2025-04-10'),
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
        name: 'Ashley Atkinson',
        date: new Date('2025-04-10'),
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
      },{
        id: 4,
        name: 'Ashley Atkinson',
        date: new Date('2025-04-10'),
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
      },{
        id: 5,
        name: 'Ashley Atkinson',
        date: new Date('2025-04-10'),
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
      },{
        id: 6,
        name: 'Ashley Atkinson',
        date: new Date('2025-04-10'),
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
    ]);

    // Reset selected items on view mode change
    this.viewModeObs$
      .pipe(takeUntil(this.destroy$), debounceTime(100))
      .subscribe(() => this.selectedItems$.next([]));
  }

  // Event handlers
  onViewModeChange(viewMode: 'tiles' | 'thumbnails-large' | 'thumbnails-small'): void {
    this.viewMode$.next(viewMode);
  }

  onTileClick(procedure: Project): void {
    this.selectedProcedure$.next(procedure);
  }

  closeGallery(): void {
    this.selectedProcedure$.next(null);
  }

  togglePrivate(procedure: Project): void {
    const procedures = this.procedures$.value;
    const updatedProcedure = { ...procedure, isPrivate: !procedure.isPrivate };
    const updatedProcedures = procedures.map(p => (p.id === procedure.id ? updatedProcedure : p));
    this.procedures$.next(updatedProcedures);
  }

  toggleSelection(id: number): void {
    const currentSelection = this.selectedItems$.value;
    const newSelection = currentSelection.includes(id)
      ? currentSelection.filter(item => item !== id)
      : [...currentSelection, id];
    this.selectedItems$.next(newSelection);
  }

  togglePrivateForSelected(): void {
    const allPrivate = this.selectedItems$.value.every(id => {
      const procedure = this.procedures$.value.find(p => p.id === id);
      return procedure?.isPrivate ?? false;
    });

    const procedures = this.procedures$.value;
    const updatedProcedures = procedures.map(procedure => {
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
    console.log('Received tile to add:', tile);
    if (!procedures.some(p => p.id === tile.id)) {
      console.log('Adding tile to procedures:', tile);
      this.procedures$.next([...procedures, tile]);
      this.cdr.detectChanges(); // Force change detection
    } else {
      console.log('Tile already exists in procedures:', tile.id);
    }
  }

  onRemoveTile(id: number): void {
    const procedures = this.procedures$.value;
    console.log('Removing tile with id:', id);
    this.procedures$.next(procedures.filter(p => p.id !== id));
    this.cdr.detectChanges(); // Force change detection
  }

  toggleTilesMore(): void {
    this.showTilesMore = !this.showTilesMore;
  }

  // Sanitize URLs for safe rendering
  safeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
