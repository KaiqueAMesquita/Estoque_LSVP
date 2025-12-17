import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PTableComponent } from '../../../shared/components/p-table/p-table.component';
import { UserService } from './../../../core/services/user.service';
import { User } from './../../../shared/models/user';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from './../../../core/authentication/authentication.service';
import { NavigationWatcherService } from '../../../core/services/navigation-watcher.service';
import { ModalModule } from '../../../shared/modules/modal/modal.module';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { ViewTemplateComponent } from '../../../shared/components/view-template/view-template.component';
import { Page } from '../../../shared/models/page';

@Component({
  selector: 'app-users-view',
  imports: [PTableComponent, CommonModule, ModalModule, ViewTemplateComponent],
 standalone: true,
templateUrl: './users-view.component.html',

})
export class UsersViewComponent implements OnInit, OnDestroy, AfterViewInit {
  users: User[] = []; // Array para armazenar os usuários
  private navigationSub?: Subscription;
  isDeleted: boolean = false; // Variável para controlar a exibição do modal de exclusão
  pagedView: boolean = false;
  pageNumber: number = 0;
  totalPages: number = 0;
  private searchTerm: string = '';
  @ViewChild('exceptionUser') exceptionUser!: ModalComponent;


  constructor(private userService :UserService, private auth: AuthenticationService, 
    public router: Router, private navigationWatcher: NavigationWatcherService) {}

  /**
   * Método chamado quando o componente é inicializado.
   * Busca todos os usuários e os armazena no array `users`.
   */
  ngOnInit(): void {
     // Atualiza ao iniciar
    this.loadUsers(this.pageNumber);

     this.navigationSub = this.navigationWatcher.navigation$.subscribe(() => {
      // 3. Verifique se está na rota deste componente
      if (this.router.url.startsWith('/users')) { // ajuste conforme sua rota
        this.loadUsers(this.pageNumber);
      }
    });

    // Ouve eventos de navegação e recarrega se a rota atual for a deste componente
  
  }

    ngAfterViewInit(): void {}

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
  private loadUsers(page: number = 0, name?: string): void {
    this.userService.getAllUsers(page, 20, 'id,desc', name).subscribe({
      next: (data: Page<User>) => {
        data.totalPages > 1 ? this.pagedView = true : this.pagedView = false;
        this.users = data.content;
        this.pageNumber = data.number;
        this.totalPages = data.totalPages;
      },
      error: (error) => {
        console.error('Erro ao buscar usuários:', error);
      }
    });
  }


  // Método para deletar um usuário
  DeleteUser(userId: number): void {
    const token = this.auth.decodeToken();
    if (!token || !token.sub) {
      console.error('Usuário não autenticado ou token inválido.');
      // Opcionalmente, exiba um modal de erro ou redirecione para o login
      return;
    }

    const loggedInUserName = token.sub;
    const userToDelete = this.users.find(user => user.id === userId);

    if (!userToDelete) {
      console.error(`Usuário com ID ${userId} não encontrado na lista local. Possível dessincronização de dados.`);
      // Considere recarregar os usuários ou exibir um erro para o usuário.
      return;
    }

    const userNameToDelete = userToDelete.name;

    if (userNameToDelete === loggedInUserName) {
      // Se o usuário for o mesmo que está logado, não permite a exclusão
      console.error('Não é possível deletar o próprio usuário.');
      this.exceptionUser.toggle();
      return;
    }

    // Prossiga com a exclusão se não for autoexclusão
    this.userService.deleteUser(userId).subscribe({
      next: () => {
        this.users = this.users.filter(user => user.id !== userId); // Atualiza a UI após exclusão bem-sucedida
      },
      error: (error) => {
        console.error('Erro ao deletar usuário:', error);
        // Implemente uma exibição de erro mais amigável ao usuário, se necessário
      }
    });
   
  }

  // Método para redirecionar para a página de edição de usuário
  EditUser(id: number): void {
    // Redireciona para a rota de edição de usuário
    this.router.navigate(['manage/edit/user', id]);


  }

  onPageChange(page: number): void {
    this.pageNumber = page;
    this.loadUsers(page);
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.loadUsers(0, this.searchTerm);
  }
}