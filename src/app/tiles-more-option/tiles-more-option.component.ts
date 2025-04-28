import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface TileItem {
  id: number;
  title: string;
  description: string;
  status: 'Active' | 'Inactive';
  showOptions: boolean;
}
@Component({
  selector: 'app-tiles-more-option',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tiles-more-option.component.html',
  styleUrl: './tiles-more-option.component.scss'
})
export class TilesMoreOptionComponent {
  items: TileItem[] = [
    {
      id: 1,
      title: 'Project Alpha',
      description: 'A web app for task management.',
      status: 'Active',
      showOptions: false
    },
    {
      id: 2,
      title: 'Project Beta',
      description: 'Mobile app for fitness tracking.',
      status: 'Inactive',
      showOptions: false
    },
    {
      id: 3,
      title: 'Project Gamma',
      description: 'AI-powered analytics dashboard.',
      status: 'Active',
      showOptions: false
    },
    {
      id: 4,
      title: 'Project Delta',
      description: 'E-commerce platform.',
      status: 'Inactive',
      showOptions: false
    }
  ];
  constructor() {}

  ngOnInit(): void {}

  toggleOptions(id: number): void {
    this.items = this.items.map(item => ({
      ...item,
      showOptions: item.id === id ? !item.showOptions : false
    }));
  }

  handleAction(id: number, action: string): void {
    console.log(`Action: ${action} on item ${id}`);
    // Implement action logic here (e.g., edit, delete, view)
    this.toggleOptions(id); // Close menu after action
  }
}
