import { Component, OnDestroy, OnInit } from '@angular/core';
import { PTableComponent } from '../../../shared/components/p-table/p-table.component';
import { UserService } from './../../../core/services/user.service';
import { User } from './../../../shared/models/user';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from './../../../core/authentication/authentication.service';
import { NavigationWatcherService } from '../../../core/services/navigation-watcher.service';

@Component({
  selector: 'app-users-view',
  imports: [PTableComponent, CommonModule],
 standalone: true,
templateUrl: './users-view.component.html',
  styleUrl: './users-view.component.css'
})
export class UsersViewComponent implements OnInit, OnDestroy {
  users: User[] = []; // Array para armazenar os usuários
    private navigationSub?: Subscription;


  constructor(private userService :UserService, private auth: AuthenticationService, 
    private router: Router, private navigationWatcher: NavigationWatcherService) {}

  /**
   * Método chamado quando o componente é inicializado.
   * Busca todos os usuários e os armazena no array `users`.
   */
  ngOnInit(): void {
     // Atualiza ao iniciar
    this.loadUsers();

     this.navigationSub = this.navigationWatcher.navigation$.subscribe(() => {
      // 3. Verifique se está na rota deste componente
      if (this.router.url.startsWith('/users')) { // ajuste conforme sua rota
        this.loadUsers();
      }
    });

    // Ouve eventos de navegação e recarrega se a rota atual for a deste componente
  
  }
  /**
    Método para obter o token de autenticação do usuário.
   retorna O token de autenticação ou null se não estiver autenticado.
   */
  public getToken(): string | null {
    return this.auth.getToken();
  }
  

    ngOnDestroy(): void {
    // Limpa a assinatura para evitar vazamentos de memória
       this.navigationSub?.unsubscribe();

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

  // Método para redirecionar para a página de edição de usuário
  EditUser(id: number): void {
    // Redireciona para a rota de edição de usuário
    this.router.navigate(['manage/edit/user', id]);


  }
}