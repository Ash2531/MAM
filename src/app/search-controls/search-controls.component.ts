import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 *
 */
@Component({
  selector: 'app-search-controls',
  standalone: false,
  templateUrl: './search-controls.component.html',
  styleUrls: ['./search-controls.component.scss'],
})
export class SearchControlsComponent {
  @Input() viewMode: 'tiles' | 'thumbnails-large' | 'thumbnails-small' | null = 'tiles';
  @Input() selectedItems: number[] = [];
  @Input() allSelectedPrivate: boolean | null = false;
  @Output() readonly viewModeChange = new EventEmitter<'tiles' | 'thumbnails-large' | 'thumbnails-small'>();
  @Output() readonly togglePrivateForSelected = new EventEmitter<void>();
  @Output() readonly clearSelection = new EventEmitter<void>();

  /**
   * Emits a view mode change event.
   * @param viewMode - The new view mode to emit.
   */
  onViewModeChange = (viewMode: 'tiles' | 'thumbnails-large' | 'thumbnails-small'): void => {
    this.viewModeChange.emit(viewMode);
  };

  /**
   * Emits an event to toggle the private status of selected items.
   */
  onTogglePrivateForSelected = (): void => {
    this.togglePrivateForSelected.emit();
  };

  /**
   * Emits an event to clear the current selection.
   */
  onClearSelection = (): void => {
    this.clearSelection.emit();
  };
}
