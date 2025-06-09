import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { isValid, format } from 'date-fns';

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
  standalone: true,
  templateUrl: './procedure-list.component.html',
  imports: [CommonModule, MatIconModule, MatButtonModule],
  styleUrls: ['./procedure-list.component.scss'],
})
export class ProcedureListComponent {
  @Input() procedures: Project[] = [];
  @Input() viewMode: 'tiles' | 'thumbnails-large' | 'thumbnails-small' | null =
    'tiles';
  @Input() selectedItems: number[] = [];
  @Output() readonly tileClick = new EventEmitter<Project>();
  @Output() readonly togglePrivate = new EventEmitter<Project>();
  @Output() readonly toggleSelection = new EventEmitter<number>();
  @Output() readonly removeTile = new EventEmitter<number>();

  // Helper function to format dates safely
  formatDate(date: Date | string | undefined): string {
    if (!date) return 'N/A';
    const dateObj = new Date(date);
    if (!isValid(dateObj)) {
      console.warn('Invalid date:', date);
      return 'Invalid date';
    }
    try {
      return format(dateObj, 'MMM d, yyyy');
    } catch (err) {
      console.error('Error formatting date:', err);
      return 'Invalid date';
    }
  }

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
