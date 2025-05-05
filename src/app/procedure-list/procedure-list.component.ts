import { Component } from '@angular/core';


interface ListItem {
  id: number;
  title: string;
  description: string;
  icon: string;
  isActive: boolean;
  path: string;
}
@Component({
  selector: 'app-procedure-list',
  templateUrl: './procedure-list.component.html',
  styleUrls: ['./procedure-list.component.scss']
})



export class ProcedureListComponent {
  listItems: ListItem[] = [
    {
      id: 1,
      title: 'Dashboard',
      description: 'View key metrics and insights',
      icon: 'dashboard',
      isActive: true,
      path: '/dashboard'
    },
    {
      id: 2,
      title: 'Tasks',
      description: 'Manage your daily tasks',
      icon: 'assignment',
      isActive: false,
      path: '/tasks'
    },
    {
      id: 3,
      title: 'Settings',
      description: 'Configure app preferences',
      icon: 'settings',
      isActive: false,
      path: '/settings'
    },
    {
      id: 4,
      title: 'Profile',
      description: 'Update your user information',
      icon: 'person',
      isActive: false,
      path: '/profile'
    }
  ];

  selectItem(selectedItem: ListItem): void {
    this.listItems = this.listItems.map(item => ({
      ...item,
      isActive: item.id === selectedItem.id
    }));
    console.log('Selected item:', selectedItem.title); // Debug
  }
}

