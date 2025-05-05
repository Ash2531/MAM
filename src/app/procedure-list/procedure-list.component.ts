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
  selector: 'app-procedure-list',
  templateUrl: './procedure-list.component.html',
  styleUrls: ['./procedure-list.component.scss'],
})
export class ProcedureListComponent {
  @Input() procedures: Project[] = [];
  @Input() viewMode: 'tiles' | 'thumbnails-large' | 'thumbnails-small' | null = 'tiles';
  @Input() selectedItems: number[] = [];
  @Output() readonly tileClick = new EventEmitter<Project>();
  @Output() readonly togglePrivate = new EventEmitter<Project>();
  @Output() readonly toggleSelection = new EventEmitter<number>();
  @Output() readonly removeTile = new EventEmitter<number>();

  /**
   * Handles a tile click event.
   * @param procedure - The project that was clicked.
   */
  onTileClick = (procedure: Project): void => {
    this.tileClick.emit(procedure);
  };

  /**
   * Toggles the private status of a procedure.
   * @param procedure - The project to toggle.
   */
  onTogglePrivate = (procedure: Project): void => {
    this.togglePrivate.emit(procedure);
  };

  /**
   * Toggles the selection of a procedure by ID.
   * @param id - The ID of the procedure to toggle.
   */
  onToggleSelection = (id: number): void => {
    this.toggleSelection.emit(id);
  };

  /**
   * Removes a tile by emitting its ID.
   * @param id - The ID of the tile to remove.
   */
  onRemoveTile = (id: number): void => {
    this.removeTile.emit(id);
  };
}
