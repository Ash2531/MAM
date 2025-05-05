import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

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
  selector: 'app-tiles-more-option',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tiles-more-option.component.html',
  styleUrls: ['./tiles-more-option.component.scss'],
})
export class TilesMoreOptionComponent {
  @Output() addTile = new EventEmitter<Project>();
  @Output() removeTile = new EventEmitter<number>();

  items: Project[] = [
    {
      id: 3,
      name: 'Charlie Brown',
      date: new Date('2025-05-15'),
      type: 'Image',
      itemCount: 8,
      title: 'Project Gamma',
      code: 'OR789',
      progress: 60,
      isActive: true,
      isPrivate: false,
      thumbnail: 'https://via.placeholder.com/150',
      mediaUrl: 'https://via.placeholder.com/600',
      thumbnails: [
        'https://via.placeholder.com/150',
        'https://via.placeholder.com/150/0000FF',
      ],
      mediaType: 'Image',
      procedure: 'Analytics',
      status: 'Active',
      showOptions: false,
      mediaCount: 0,
    },
    {
      id: 4,
      name: 'Diana Evans',
      date: new Date('2025-06-01'),
      type: 'Video',
      itemCount: 15,
      title: 'Project Delta',
      code: 'OR890',
      progress: 20,
      isActive: false,
      isPrivate: true,
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg',
      mediaUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnails: [
        'https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg',
        'https://img.youtube.com/vi/dQw4w9WgXcQ/1.jpg',
      ],
      mediaType: 'Video',
      procedure: 'E-commerce',
      status: 'Inactive',
      showOptions: false,
      mediaCount: 0,
    },
  ];

  toggleOptions(id: number): void {
    this.items = this.items.map(item => ({
      ...item,
      showOptions: item.id === id ? !item.showOptions : false,
    }));
  }

  handleAction(id: number, action: string): void {
    const item = this.items.find(i => i.id === id);
    if (!item) return;

    switch (action) {
      case 'add':
        this.addTile.emit(item);
        break;
      case 'delete':
        this.removeTile.emit(id);
        break;
      case 'view':
        console.log(`Viewing details for item ${id}`);
        break;
    }
    this.toggleOptions(id); // Close menu after action
  }
}
