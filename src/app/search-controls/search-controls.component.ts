import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-search-controls',
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule],
  templateUrl: './search-controls.component.html',
  styleUrls: ['./search-controls.component.scss'],
})
export class SearchControlsComponent {
  @Input() viewMode: 'tiles' | 'thumbnails-large' | 'thumbnails-small' | null =
    'tiles';
  @Input() selectedItems: number[] = [];
  @Input() allSelectedPrivate: boolean | null = false;
  @Output() readonly viewModeChange = new EventEmitter<
    'tiles' | 'thumbnails-large' | 'thumbnails-small'
  >();
  @Output() readonly togglePrivateForSelected = new EventEmitter<void>();
  @Output() readonly clearSelection = new EventEmitter<void>();

  onViewModeChange(
    viewMode: 'tiles' | 'thumbnails-large' | 'thumbnails-small'
  ): void {
    this.viewModeChange.emit(viewMode);
  }

  onTogglePrivateForSelected(): void {
    this.togglePrivateForSelected.emit();
  }

  onClearSelection(): void {
    this.clearSelection.emit();
  }
}
