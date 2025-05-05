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

@Component({
  selector: 'app-procedure-list',
  templateUrl: './procedure-list.component.html',
  styleUrls: ['./procedure-list.component.scss'],
})
export class ProcedureListComponent {
  @Input() procedures: Project[] = [];
  @Input() viewMode: 'tiles' | 'thumbnails-large' | 'thumbnails-small' | null = 'tiles';
  @Input() selectedItems: number[] = [];
  @Output() tileClick = new EventEmitter<Project>();
  @Output() togglePrivate = new EventEmitter<Project>();
  @Output() toggleSelection = new EventEmitter<number>();
  @Output() removeTile = new EventEmitter<number>();

  onTileClick(procedure: Project): void {
    this.tileClick.emit(procedure);
  }

  onTogglePrivate(procedure: Project): void {
    this.togglePrivate.emit(procedure);
  }

  onToggleSelection(id: number): void {
    this.toggleSelection.emit(id);
  }

  onRemoveTile(id: number): void {
    this.removeTile.emit(id);
  }
}
