import { Component } from '@angular/core';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { CommonModule } from '@angular/common';
import { PTableComponent } from '../p-table/p-table.component';
import { User } from '../../models/user';

@Component({
  selector: 'app-user-table',
  imports: [NavBarComponent, PTableComponent, CommonModule],
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.css'
})
export class UserTableComponent {
   usersData: User[] = [
    { id: 1, name: 'John Doe', password: 'password123', role: 'Admin' },
    { id: 2, name: 'Jane Smith', password: 'jsmith2024', role: 'User' },
    { id: 3, name: 'Alice Johnson', password: 'alicepass', role: 'User' },
    { id: 4, name: 'Bob Brown', password: 'bobbrown!', role: 'User' },
    { id: 5, name: 'Charlie Black', password: 'charlie2024', role: 'User' }
  ];
  
    editUser(user: User) {
      console.log('Edit user:', user);
    };
    deleteUser(user: User) {
      try {
        // Simulando o deletar usuário
        console.log('Deleting user:', user);
        this.usersData = this.usersData.filter(u => u.id !== user.id);
      }catch{
        console.log('Deleting user failed', user);    }

    }

    viewUser(user: User) {
      console.log('View user:', user);
    }
  }