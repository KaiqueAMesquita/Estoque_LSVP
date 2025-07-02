import { Component, OnDestroy, OnInit } from '@angular/core';
import { PTableComponent } from '../../../shared/components/p-table/p-table.component';
import { UserService } from './../../../core/services/user.service';
import { User } from './../../../shared/models/user';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { AuthenticationService } from './../../../core/authentication/authentication.service';

@Component({
  selector: 'app-users-view',
  imports: [PTableComponent, CommonModule],
 standalone: true,
templateUrl: './users-view.component.html',
  styleUrl: './users-view.component.css'
})
export class UsersViewComponent implements OnInit, OnDestroy {
  users: User[] = []; // Array para armazenar os usuários
  private routerSubscription!: Subscription; // Assinatura para monitorar eventos de navegação do roteador
  

  constructor(private userService :UserService, private auth: AuthenticationService, private router: Router) {}

  /**
   * Método chamado quando o componente é inicializado.
   * Busca todos os usuários e os armazena no array `users`.
   */
  ngOnInit(): void {
     // Atualiza ao iniciar
    this.loadUsers();

    // Ouve eventos de navegação e recarrega se a rota atual for a deste componente
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.loadUsers();
      });
  }
  /**
    Método para obter o token de autenticação do usuário.
   retorna O token de autenticação ou null se não estiver autenticado.
   */
  public getToken(): string | null {
    return this.auth.getToken();
  }
  
  //Método para editar um usuário
  EditUser(userId: number): void {
    console.log('Editar usuário com ID:', userId);
    // Implementar lógica de edição de usuário
  }

    ngOnDestroy(): void {
    // limpar subscription para evitar memory leak
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  //Método que carrega usuário
  private loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data: User[]) => {
        this.users = data;
      },
      error: (error) => {
        console.error('Erro ao buscar usuários:', error);
      }
    });
  }

  // Método para deletar um usuário
  DeleteUser(userId: number): void {
   try {
    this.userService.deleteUser(userId); // Chama o serviço para deletar o usuário
    this.users = this.users.filter(user => user.id !== userId); // Atualiza a lista de usuários removendo o usuário deletado
   }catch (error) {
    console.error('Erro ao deletar usuário:', error);
   }
  }
}