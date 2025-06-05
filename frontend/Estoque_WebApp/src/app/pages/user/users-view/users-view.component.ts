import { Component, OnInit } from '@angular/core';
import { PTableComponent } from '../../../shared/components/p-table/p-table.component';
import { UserService } from './../../../core/services/user.service';
import { User } from './../../../shared/models/user';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from './../../../core/authentication/authentication.service';

@Component({
  selector: 'app-users-view',
  imports: [PTableComponent, CommonModule],
 standalone: true,
templateUrl: './users-view.component.html',
  styleUrl: './users-view.component.css'
})
export class UsersViewComponent implements OnInit {
  users: User[] = [];

  constructor(private userService :UserService, private auth: AuthenticationService) {}

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe({
      next: (data: any) => {
        console.log('Dados recebidos:', data); 
        this.users = data;
      },
      error: (error: any) => {
        console.error('Erro ao buscar usuários:', error);
      }
    });
  }
  public getToken(): string | null {
    return this.auth.getToken();
  }
  
  EditUser(userId: number): void {
    console.log('Editar usuário com ID:', userId);
    // Implementar lógica de edição de usuário
  }
  DeleteUser(userId: number): void {
   try {
    this.userService.deleteUser(userId);
    this.users = this.users.filter(user => user.id !== userId);
   }catch (error) {
    console.error('Erro ao deletar usuário:', error);
   }
  }
  logout(): void {
    this.auth.logout();
    console.log('Usuário deslogado com sucesso');
  }
  

}