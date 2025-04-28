import { Component } from '@angular/core';

interface Category {
  id: number;
  name: string;
}

interface SortOption {
  id: number;
  name: string;
  key: string;
  order: 'asc' | 'desc';
}

interface Procedure {
  id: number;
  title: string;
  description: string;
  categoryId: number;
  date: string;
  icon: string;
  isActive: boolean;
}
@Component({
  selector: 'app-search-controls',
  templateUrl: './search-controls.component.html',
  styleUrls: ['./search-controls.component.scss']
})
export class SearchControlsComponent {
  searchQuery: string = '';
  selectedCategory: number | null = null;
  selectedSort: number | null = null;

  categories: Category[] = [
    { id: 0, name: 'All Categories' },
    { id: 1, name: 'Patient Registration' },
    { id: 2, name: 'Appointments' },
    { id: 3, name: 'Medical Records' },
    { id: 4, name: 'Billing' },
    { id: 5, name: 'Lab Results' },
    { id: 6, name: 'Prescriptions' }
  ];

  sortOptions: SortOption[] = [
    { id: 1, name: 'Relevance', key: 'relevance', order: 'desc' },
    { id: 2, name: 'Date (Newest First)', key: 'date', order: 'desc' },
    { id: 3, name: 'Date (Oldest First)', key: 'date', order: 'asc' },
    { id: 4, name: 'Alphabetical (A-Z)', key: 'title', order: 'asc' },
    { id: 5, name: 'Alphabetical (Z-A)', key: 'title', order: 'desc' },
    { id: 6, name: 'Category', key: 'categoryId', order: 'asc' }
  ];

  procedures: Procedure[] = [
    {
      id: 1,
      title: 'New Patient Registration',
      description: 'Complete patient onboarding form',
      categoryId: 1,
      date: '2025-04-20',
      icon: 'person_add',
      isActive: false
    },
    {
      id: 2,
      title: 'Follow-up Appointment',
      description: 'Schedule follow-up with Dr. Smith',
      categoryId: 2,
      date: '2025-04-22',
      icon: 'event',
      isActive: false
    },
    {
      id: 3,
      title: 'Patient Record Update',
      description: 'Update medical history for John Doe',
      categoryId: 3,
      date: '2025-04-18',
      icon: 'folder_open',
      isActive: false
    },
    {
      id: 4,
      title: 'Invoice Generation',
      description: 'Generate invoice for recent visit',
      categoryId: 4,
      date: '2025-04-21',
      icon: 'payment',
      isActive: false
    },
    {
      id: 5,
      title: 'Blood Test Results',
      description: 'Review lab results for patient',
      categoryId: 5,
      date: '2025-04-19',
      icon: 'science',
      isActive: false
    },
    {
      id: 6,
      title: 'Prescription Refill',
      description: 'Refill medication for Jane Roe',
      categoryId: 6,
      date: '2025-04-23',
      icon: 'medication',
      isActive: false
    },
    {
      id: 7,
      title: 'Emergency Appointment',
      description: 'Urgent care scheduling',
      categoryId: 2,
      date: '2025-04-24',
      icon: 'event',
      isActive: false
    },
    {
      id: 8,
      title: 'Insurance Billing',
      description: 'Submit claim to insurance provider',
      categoryId: 4,
      date: '2025-04-17',
      icon: 'payment',
      isActive: false
    }
  ];

  filteredResults: Procedure[] = [...this.procedures];

  constructor() {
    this.performSearch(); // Initialize results
  }

  performSearch(): void {
    let results = [...this.procedures];

    // Search by keyword
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase().trim();
      results = results.filter(procedure =>
        procedure.title.toLowerCase().includes(query) ||
        procedure.description.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (this.selectedCategory !== null && this.selectedCategory !== 0) {
      results = results.filter(procedure => procedure.categoryId === this.selectedCategory);
    }

    // Sort results
    if (this.selectedSort !== null) {
      const sortOption = this.sortOptions.find(s => s.id === this.selectedSort);
      if (sortOption) {
        results.sort((a, b) => {
          const key = sortOption.key as keyof Procedure;
          const aValue = a[key] as string | number;
          const bValue = b[key] as string | number;
          if (sortOption.order === 'asc') {
            return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
          } else {
            return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
          }
        });
      }
    }

    this.filteredResults = results;
    console.log('Search results:', this.filteredResults); // Debug
  }

  selectResult(selectedResult: Procedure): void {
    this.filteredResults = this.filteredResults.map(result => ({
      ...result,
      isActive: result.id === selectedResult.id
    }));
    console.log('Selected result:', selectedResult.title); // Debug
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.selectedCategory = null;
    this.selectedSort = null;
    this.filteredResults = [...this.procedures];
    console.log('Search cleared, results reset'); // Debug
  }
}
