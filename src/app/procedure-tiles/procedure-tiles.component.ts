import { Component, EventEmitter, Input, Output } from '@angular/core';
import { format, isValid } from 'date-fns';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
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

@Component({
  selector: 'app-procedure-tiles',
  standalone: true,
  templateUrl: './procedure-tiles.component.html',
  imports: [TranslateModule, CommonModule],
  styleUrls: ['./procedure-tiles.component.scss'],
})
export class ProcedureTilesComponent {
  @Input() procedure!: Project;
  @Input() viewMode: 'tiles' | 'thumbnails-large' | 'thumbnails-small' | null =
    'tiles';
  @Input() isSelected = false;
  @Output() readonly tileClick = new EventEmitter<Project>();
  @Output() readonly togglePrivate = new EventEmitter<Project>();
  @Output() readonly toggleSelection = new EventEmitter<number>();
  @Output() readonly removeTile = new EventEmitter<number>();

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

  formatDate(date: Date | string, dateFormat = 'yyyy-MM-dd'): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (!isValid(dateObj)) {
      return 'Invalid date';
    }
    return format(dateObj, dateFormat);
  }
}
