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
  selector: 'app-procedure-tiles',
  templateUrl: './procedure-tiles.component.html',
  styleUrls: ['./procedure-tiles.component.scss'],
})
export class ProcedureTilesComponent {
  @Input() procedure!: Project;
  @Input() viewMode: 'tiles' | 'thumbnails-large' | 'thumbnails-small' | null = 'tiles';
  @Input() isSelected: boolean = false;
  @Output() tileClick = new EventEmitter<Project>();
  @Output() togglePrivate = new EventEmitter<Project>();
  @Output() toggleSelection = new EventEmitter<number>();
  @Output() removeTile = new EventEmitter<number>();

  onTileClick(): void {
    this.tileClick.emit(this.procedure);
  }

  onTogglePrivate(event: Event): void {
    event.stopPropagation();
    this.togglePrivate.emit(this.procedure);
  }

  onToggleSelection(event: Event): void {
    event.stopPropagation();
    this.toggleSelection.emit(this.procedure.id);
  }

  onRemoveTile(event: Event): void {
    event.stopPropagation();
    this.removeTile.emit(this.procedure.id);
  }
}
