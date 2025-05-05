import { Component, EventEmitter, Input, Output } from '@angular/core';

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

/**
 *
 */
@Component({
  selector: 'app-procedure-tiles',
  templateUrl: './procedure-tiles.component.html',
  styleUrls: ['./procedure-tiles.component.scss'],
})
export class ProcedureTilesComponent {
  @Input() procedure!: Project;
  @Input() viewMode: 'tiles' | 'thumbnails-large' | 'thumbnails-small' | null = 'tiles';
  @Input() isSelected = false;
  @Output() readonly tileClick = new EventEmitter<Project>();
  @Output() readonly togglePrivate = new EventEmitter<Project>();
  @Output() readonly toggleSelection = new EventEmitter<number>();
  @Output() readonly removeTile = new EventEmitter<number>();

  /**
   * Handles a tile click event.
   */
  onTileClick = (): void => {
    this.tileClick.emit(this.procedure);
  };

  /**
   * Toggles the private status of the procedure.
   * @param event - The DOM event to stop propagation.
   */
  onTogglePrivate = (event: Event): void => {
    event.stopPropagation();
    this.togglePrivate.emit(this.procedure);
  };

  /**
   * Toggles the selection of the procedure.
   * @param event - The DOM event to stop propagation.
   */
  onToggleSelection = (event: Event): void => {
    event.stopPropagation();
    this.toggleSelection.emit(this.procedure.id);
  };

  /**
   * Removes the tile by emitting its ID.
   * @param event - The DOM event to stop propagation.
   */
  onRemoveTile = (event: Event): void => {
    event.stopPropagation();
    this.removeTile.emit(this.procedure.id);
  };
}
