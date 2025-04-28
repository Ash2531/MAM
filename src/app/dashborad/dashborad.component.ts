import { Component } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';

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
}
@Component({
  selector: 'app-dashborad',
  templateUrl: './dashborad.component.html',
  styleUrls: ['./dashborad.component.scss']
})
export class DashboradComponent {
  projects: Project[] = [
    {
      id: 1,
      name: 'Ashley Atkinson',
      date: new Date('2025-04-10'),
      mediaType: 'Video',
      mediaCount: 12,
      procedure: 'Thrift Cabble Replca / OR646',
      progress: 75,
      status: 'Inactive',
      showOptions: false,
      thumbnail: 'https://picsum.photos/200/150?random=1'
    },
    {
      id: 2,
      name: 'Catherine Ellis',
      date: new Date('2025-04-10'),
      mediaType: 'Image',
      mediaCount: 10,
      procedure: 'Arrange Certify Uphold / OR277',
      progress: 40,
      status: 'Inactive',
      showOptions: false,
      thumbnail: 'https://picsum.photos/200/150?random=2'
    },
    {
      id: 3,
      name: 'Adam Garcia',
      date: new Date('2025-03-25'),
      mediaType: 'Video',
      mediaCount: 10,
      procedure: 'Storewide Satiable Swoop / OR619',
      progress: 90,
      status: 'Active',
      showOptions: false,
      thumbnail: 'https://picsum.photos/200/150?random=3'
    },
    {
      id: 4,
      name: 'Lori Wells',
      date: new Date('2025-03-25'),
      mediaType: 'Video',
      mediaCount: 0,
      procedure: 'Array Grimacing Comprised / OR888',
      progress: 60,
      status: 'Inactive',
      showOptions: false,
      thumbnail: 'https://picsum.photos/200/150?random=4'
    }
  ];

  filteredProjects: Project[] = [...this.projects]; // Track filtered/sorted projects
  displayMode: string = 'tiles'; // Default display mode
  searchQuery: string = ''; // Search input
  sortDirection: 'asc' | 'desc' = 'asc'; // Sort direction
  sortBy: 'name' | 'date' = 'name'; // Sort by field
  filterByStatus: 'all' | 'Active' | 'Inactive' = 'all'; // Filter by status

  constructor() {
    // Compute status dynamically based on progress
    this.projects = this.projects.map(project => ({
      ...project,
      status: project.progress > 80 ? 'Active' : 'Inactive'
    }));
    this.applyFiltersAndSort(); // Initial apply
  }

  ngOnInit(): void {}

  toggleOptions(id: number): void {
    this.filteredProjects = this.filteredProjects.map(project => ({
      ...project,
      showOptions: project.id === id ? !project.showOptions : false
    }));
  }

  handleAction(id: number, action: string): void {
    console.log(`Action: ${action} on project ${id}`);
    this.toggleOptions(id); // Close menu after action
  }

  onDisplayChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.displayMode = selectElement.value;
  }

  onSearch(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchQuery = inputElement.value.toLowerCase();
    this.applyFiltersAndSort();
  }

  onFilter(): void {
    // Toggle filter between 'all', 'Active', and 'Inactive'
    this.filterByStatus = this.filterByStatus === 'all' ? 'Active' : this.filterByStatus === 'Active' ? 'Inactive' : 'all';
    this.applyFiltersAndSort();
  }

  onSort(): void {
    // Toggle sort direction and alternate between name and date
    if (this.sortBy === 'name') {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = 'date';
      this.sortDirection = 'asc'; // Reset to asc when switching to date
    }
    this.applyFiltersAndSort();
  }

  private applyFiltersAndSort(): void {
    let result = [...this.projects];

    // Apply search filter
    if (this.searchQuery) {
      result = result.filter(project =>
        project.name.toLowerCase().includes(this.searchQuery) ||
        project.procedure.toLowerCase().includes(this.searchQuery)
      );
    }

    // Apply status filter
    if (this.filterByStatus !== 'all') {
      result = result.filter(project => project.status === this.filterByStatus);
    }

    // Apply sort
    result.sort((a, b) => {
      if (this.sortBy === 'name') {
        const valueA = a.name.toLowerCase();
        const valueB = b.name.toLowerCase();
        return this.sortDirection === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      } else {
        const valueA = a.date.getTime();
        const valueB = b.date.getTime();
        return this.sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
      }
    });

    this.filteredProjects = result;
  }
}
