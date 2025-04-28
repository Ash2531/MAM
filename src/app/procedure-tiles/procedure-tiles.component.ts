import { Component } from '@angular/core';

interface Procedure {
  id: number;
  title: string;
  description: string;
  icon: string;
  isActive: boolean;
}

@Component({
  selector: 'app-procedure-tiles',
  templateUrl: './procedure-tiles.component.html',
  styleUrls: ['./procedure-tiles.component.scss']
})
export class ProcedureTilesComponent {
  procedures: Procedure[] = [
    {
      id: 1,
      title: 'Patient Registration',
      description: 'Register new patients in the system',
      icon: 'person_add',
      isActive: true
    },
    {
      id: 2,
      title: 'Appointment Scheduling',
      description: 'Book and manage appointments',
      icon: 'event',
      isActive: false
    },
    {
      id: 3,
      title: 'Medical Records',
      description: 'Access and update patient records',
      icon: 'folder_open',
      isActive: false
    },
    {
      id: 4,
      title: 'Billing Process',
      description: 'Generate and manage invoices',
      icon: 'payment',
      isActive: false
    }
  ];

  selectProcedure(selectedProcedure: Procedure): void {
    this.procedures = this.procedures.map(procedure => ({
      ...procedure,
      isActive: procedure.id === selectedProcedure.id
    }));
    console.log('Selected procedure:', selectedProcedure.title); // Debug
  }
}
