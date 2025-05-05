import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-search-controls',
  templateUrl: './search-controls.component.html',
  styleUrls: ['./search-controls.component.scss'],
})
export class SearchControlsComponent {
  @Input() viewMode: 'tiles' | 'thumbnails-large' | 'thumbnails-small' | null = 'tiles';
  @Input() selectedItems: number[] = [];
  @Input() allSelectedPrivate: boolean | null = false;
  @Output() viewModeChange = new EventEmitter<'tiles' | 'thumbnails-large' | 'thumbnails-small'>();
  @Output() togglePrivateForSelected = new EventEmitter<void>();
  @Output() clearSelection = new EventEmitter<void>();

  onViewModeChange(viewMode: 'tiles' | 'thumbnails-large' | 'thumbnails-small'): void {
    this.viewModeChange.emit(viewMode);
  }

  onTogglePrivateForSelected(): void {
    this.togglePrivateForSelected.emit();
  }

  onClearSelection(): void {
    this.clearSelection.emit();
  }
}
