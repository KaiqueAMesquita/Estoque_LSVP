import { Component } from '@angular/core';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { CommonModule } from '@angular/common';
import { PTableComponent } from '../p-table/p-table.component';

interface User {
    id: string;
    name: string;
    role: string;
    AdditionalField: string;
    Edit?: string; // Campo para Editar
    Delete?: string; // Campo para Deletar
  }
@Component({
  selector: 'app-u-table',
  imports: [NavBarComponent, PTableComponent, CommonModule],
  templateUrl: './u-table.component.html',
  styleUrl: './u-table.component.css'
})
export class UTableComponent {
  usersData: User[] = [
      { id: '1', name: 'John Doe', role: 'Admin', AdditionalField: 'Extra Info 1', Edit: 'Editar', Delete: 'Deletar' },
      { id: '2', name: 'Jane Smith', role: 'User', AdditionalField: 'Extra Info 2', Edit: 'Editar', Delete: 'Deletar' },
      { id: '3', name: 'Alice Johnson', role: 'User', AdditionalField: 'Extra Info 3', Edit: 'Editar', Delete: 'Deletar' },
      { id: '4', name: 'Bob Brown', role: 'User', AdditionalField: 'Extra Info 4', Edit: 'Editar', Delete: 'Deletar' },
      { id: '5', name: 'Charlie Black', role: 'User', AdditionalField: 'Extra Info 5', Edit: 'Editar', Delete: 'Deletar' },
      { id: '6', name: 'Diana White', role: 'User', AdditionalField: 'Extra Info 6', Edit: 'Editar', Delete: 'Deletar' },
      { id: '7', name: 'Ethan Green', role: 'User', AdditionalField: 'Extra Info 7', Edit: 'Editar', Delete: 'Deletar' },
      { id: '8', name: 'Fiona Blue', role: 'User', AdditionalField: 'Extra Info 8', Edit: 'Editar', Delete: 'Deletar' },
      { id: '9', name: 'George Yellow', role: 'User', AdditionalField: 'Extra Info 9', Edit: 'Editar', Delete: 'Deletar' },
      { id: '10', name: 'Hannah Purple', role: 'User', AdditionalField: 'Extra Info 10', Edit: 'Editar', Delete: 'Deletar' },
      { id: '11', name: 'Ian Orange', role: 'User', AdditionalField: 'Extra Info 11', Edit: 'Editar', Delete: 'Deletar' },
      { id: '12', name: 'Julia Pink', role: 'User', AdditionalField: 'Extra Info 12', Edit: 'Editar', Delete: 'Deletar' },
      { id: '13', name: 'Kevin Gray', role: 'User', AdditionalField: 'Extra Info 13', Edit: 'Editar', Delete: 'Deletar' },
      { id: '14', name: 'Laura Cyan', role: 'User', AdditionalField: 'Extra Info 14', Edit: 'Editar', Delete: 'Deletar' },
      { id: '15', name: 'Mike Magenta', role: 'User', AdditionalField: 'Extra Info 15', Edit: 'Editar', Delete: 'Deletar' }, 
    ];
  
    usersColumn:{key: keyof User; label:string}[] = [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Name' },
      { key: 'role', label: 'Role' },
      { key: 'AdditionalField', label: 'Additional Field' },
      { key: 'Edit', label: 'Edit' },
      { key: 'Delete', label: 'Delete' }
    ];
}
// :{key: keyof User; label:string}[]
