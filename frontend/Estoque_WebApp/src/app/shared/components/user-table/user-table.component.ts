import { Component } from '@angular/core';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { CommonModule } from '@angular/common';
import { PTableComponent } from '../p-table/p-table.component';

interface User {
    id: string;
    name: string;
    role: string;
    AdditionalField: string; // Campo adicional para demonstração
    // Outros campos adicionais podem ser adicionados aqui
  }
@Component({
  selector: 'app-user-table',
  imports: [NavBarComponent, PTableComponent, CommonModule],
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.css'
})
export class UserTableComponent {
  usersData: User[] = [
      { id: '1', name: 'John Doe', role: 'Admin', AdditionalField: 'Extra Info 1'},
      { id: '2', name: 'Jane Smith', role: 'User', AdditionalField: 'Extra Info 2'},
      { id: '3', name: 'Alice Johnson', role: 'User', AdditionalField: 'Extra Info 3'},
      { id: '4', name: 'Bob Brown', role: 'User', AdditionalField: 'Extra Info 4'},
      { id: '5', name: 'Charlie Black', role: 'User', AdditionalField: 'Extra Info 5'},
      { id: '6', name: 'Diana White', role: 'User', AdditionalField: 'Extra Info 6'},
      { id: '7', name: 'Ethan Green', role: 'User', AdditionalField: 'Extra Info 7'},
      { id: '8', name: 'Fiona Blue', role: 'User', AdditionalField: 'Extra Info 8'},
      { id: '9', name: 'George Yellow', role: 'User', AdditionalField: 'Extra Info 9'},
      { id: '10', name: 'Hannah Purple', role: 'User', AdditionalField: 'Extra Info 10'},
      { id: '11', name: 'Ian Orange', role: 'User', AdditionalField: 'Extra Info 11'},
      { id: '12', name: 'Julia Pink', role: 'User', AdditionalField: 'Extra Info 12'},
      { id: '13', name: 'Kevin Gray', role: 'User', AdditionalField: 'Extra Info 13'},
      { id: '14', name: 'Laura Cyan', role: 'User', AdditionalField: 'Extra Info 14'},
      { id: '15', name: 'Mike Magenta', role: 'User', AdditionalField: 'Extra Info 15'}, 
    ];
  
    usersColumn:{key: keyof User; label:string}[] = [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Name' },
      { key: 'role', label: 'Role' },
      { key: 'AdditionalField', label: 'Additional Field' },
    ];
    editUser(user: User) {
      console.log('Edit user:', user);
    };
    deleteUser(user: User) {
      console.log('Delete user:', user);
    }
// :{key: keyof User; label:string}[]
  }