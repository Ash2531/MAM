import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  map,
  Observable,
  Subject,
  takeUntil,
} from 'rxjs';


interface Project {
  id: number;
  name: string;
  date: Date | string;
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

/**
 *
 */
@Component({
  selector: 'app-dashborad',
  standalone: false,
  templateUrl: './dashborad.component.html',
  styleUrls: ['./dashborad.component.scss'],
})
export class DashboradComponent implements OnDestroy {
  private readonly viewMode$ = new BehaviorSubject<
    'tiles' | 'thumbnails-large' | 'thumbnails-small'
  >('tiles');
  private readonly selectedItems$ = new BehaviorSubject<number[]>([]);
  private readonly selectedProcedure$ = new BehaviorSubject<Project | null>(
    null
  );
  public readonly procedures$ = new BehaviorSubject<Project[]>([]);
  private readonly destroy$ = new Subject<void>();
  formattedDate = '';
  showTilesMore = false;
  translatedText!: string;
  viewModeObs$: Observable<'tiles' | 'thumbnails-large' | 'thumbnails-small'> =
    this.viewMode$.asObservable();
  selectedItemsObs$: Observable<number[]> = this.selectedItems$.asObservable();
  selectedProcedureObs$: Observable<Project | null> =
    this.selectedProcedure$.asObservable();
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

  /**
   *
   * @param sanitizer
   * @param cdr
   * @param translate
   * @param apollo
   * @param gqlSse
   */
  constructor(
    private readonly sanitizer: DomSanitizer,
    private readonly cdr: ChangeDetectorRef,
    private translate: TranslateService,
  ) {}

  /**
   *
   */
  public ngOnInit(): void {
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
      {
        id: 4,
        name: 'Clara Donovan',
        date: new Date('2025-14-01'),
        type: 'Image',
        itemCount: 15,
        title: 'Warehouse Sorting Guide',
        code: 'OR801',
        progress: 45,
        isActive: false,
        isPrivate: false,
        thumbnail:
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
        mediaUrl:
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
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
    ]);

    this.viewModeObs$
      .pipe(takeUntil(this.destroy$), debounceTime(100))
      .subscribe(() => this.selectedItems$.next([]));


  }

  /**
   * Changes the view mode of the dashboard.
   * @param viewMode - The new view mode to set.
   */
  public onViewModeChange = (
    viewMode: 'tiles' | 'thumbnails-large' | 'thumbnails-small'
  ): void => {
    this.viewMode$.next(viewMode);
  };

  /**
   * Handles tile click to show its details in the gallery.
   * @param procedure - The project to display.
   */
  public onTileClick = (procedure: Project): void => {
    this.selectedProcedure$.next(procedure);
  };

  /**
   * Closes the gallery view.
   */
  public closeGallery = (): void => {
    this.selectedProcedure$.next(null);
  };

  /**
   * Toggles the private status of a procedure.
   * @param procedure - The project to toggle.
   */
  public togglePrivate = (procedure: Project): void => {
    const procedures = this.procedures$.value;
    const updatedProcedure = { ...procedure, isPrivate: !procedure.isPrivate };
    const updatedProcedures = procedures.map((p) =>
      p.id === procedure.id ? updatedProcedure : p
    );
    this.procedures$.next(updatedProcedures);
  };

  /**
   * Toggles selection of a procedure by ID.
   * @param id - The ID of the procedure to toggle.
   */
  public toggleSelection = (id: number): void => {
    const currentSelection = this.selectedItems$.value;
    const newSelection = currentSelection.includes(id)
      ? currentSelection.filter((item) => item !== id)
      : [...currentSelection, id];
    this.selectedItems$.next(newSelection);
  };

  /**
   * Toggles the private status of all selected procedures.
   */
  public togglePrivateForSelected = (): void => {
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
  };

  /**
   * Clears the current selection of procedures.
   */
  public clearSelection = (): void => {
    this.selectedItems$.next([]);
  };

  /**
   * Adds a new tile to the dashboard.
   * @param tile - The project tile to add.
   */
  public onAddTile = (tile: Project): void => {
    const procedures = this.procedures$.value;
    if (!procedures.some((p) => p.id === tile.id)) {
      this.procedures$.next([...procedures, tile]);
      this.cdr.detectChanges();
    }
  };

  /**
   * Removes a tile from the dashboard by ID.
   * @param id - The ID of the tile to remove.
   */
  public onRemoveTile = (id: number): void => {
    const procedures = this.procedures$.value;
    this.procedures$.next(procedures.filter((p) => p.id !== id));
    this.cdr.detectChanges();
  };

  /**
   * Toggles the visibility of the "Tiles More" section.
   */
  public toggleTilesMore = (): void => {
    this.showTilesMore = !this.showTilesMore;
  };

  /**
   * Sanitizes a URL for safe rendering in the template.
   * @param url - The URL to sanitize.
   * @returns A sanitized SafeResourceUrl.
   */
  public safeUrl = (url: string): SafeResourceUrl => {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  };

  /**
   *
   */
  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
