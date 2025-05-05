import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DashboradComponent } from './dashborad.component';
import { MatMenuModule } from '@angular/material/menu';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

describe('DashboradComponent', () => {
  let component: DashboradComponent;
  let fixture: ComponentFixture<DashboradComponent>;
  let sanitizer: DomSanitizer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatMenuModule, BrowserModule, FormsModule],
      declarations: [DashboradComponent],
      providers: [DomSanitizer]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboradComponent);
    component = fixture.componentInstance;
    sanitizer = TestBed.inject(DomSanitizer);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with tiles view mode', () => {
    component.viewModeObs$.subscribe(viewMode => {
      expect(viewMode).toBe('tiles');
    });
  });

  it('should reset selected items on view mode change', fakeAsync(() => {
    component.toggleSelection(1);
    component.onViewModeChange('thumbnails-large');
    tick(100); // Account for debounceTime
    component.selectedItemsObs$.subscribe(selectedItems => {
      expect(selectedItems).toEqual([]);
    });
  }));

  it('should select a procedure on tile click', () => {
    const procedure = component.procedures$.value[0];
    component.onTileClick(procedure);
    component.selectedProcedureObs$.subscribe(selectedProcedure => {
      expect(selectedProcedure).toEqual(procedure);
    });
  });

  it('should toggle private status', () => {
    const procedure = component.procedures$.value[0];
    component.togglePrivate(procedure);
    component.filteredProceduresObs$.subscribe(procedures => {
      expect(procedures[0].isPrivate).toBe(true);
    });
  });

  it('should toggle selection', () => {
    component.toggleSelection(1);
    component.selectedItemsObs$.subscribe(selectedItems => {
      expect(selectedItems).toEqual([1]);
    });
    component.toggleSelection(1);
    component.selectedItemsObs$.subscribe(selectedItems => {
      expect(selectedItems).toEqual([]);
    });
  });

  it('should toggle.private for selected items', () => {
    component.toggleSelection(1);
    component.toggleSelection(2);
    component.togglePrivateForSelected();
    component.filteredProceduresObs$.subscribe(procedures => {
      expect(procedures.every(p => p.isPrivate)).toBe(true);
    });
  });

  it('should clear selection', () => {
    component.toggleSelection(1);
    component.clearSelection();
    component.selectedItemsObs$.subscribe(selectedItems => {
      expect(selectedItems).toEqual([]);
    });
  });

  it('should compute allSelectedPrivate correctly', () => {
    component.toggleSelection(1);
    component.togglePrivate(component.procedures$.value[0]);
    component.allSelectedPrivateObs$.subscribe(allPrivate => {
      expect(allPrivate).toBe(true);
    });
  });

  it('should close gallery', () => {
    component.onTileClick(component.procedures$.value[0]);
    component.closeGallery();
    component.selectedProcedureObs$.subscribe(selectedProcedure => {
      expect(selectedProcedure).toBeNull();
    });
  });

  it('should sanitize media URL', () => {
    const url = 'https://www.youtube.com/embed/5qap5aO4i9A';
    const safeUrl = component.safeUrl(url);
    expect(safeUrl).toBeTruthy();
  });
});
