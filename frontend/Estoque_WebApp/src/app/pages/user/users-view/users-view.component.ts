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
  @ViewChild('exceptionUser') exceptionUser!: ModalComponent;


  constructor(private userService :UserService, private auth: AuthenticationService, 
    public router: Router, private navigationWatcher: NavigationWatcherService) {}

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
  private loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data: User[]) => {
        this.users = data;
        this.users.forEach(user => {
          delete user.id;

      },
    );
      },
      error: (error) => {
        console.error('Erro ao buscar usuários:', error);
      }
    });
  }


  // Método para deletar um usuário
  DeleteUser(userId: number): void {
  const token = this.auth.decodeToken();
  if (token && token.sub) {
    //pegar o nome do usuário na lista  user pelo id
    const userName = this.users.find(user => user.id === userId)?.name;

    console.log('Nome do usuário:', userName);
    console.log('Usuário logado:', token.sub);
    if (userName === token.sub) {
      // Se o usuário for o mesmo que está logado, não permite a exclusão
      console.error('Não é possível deletar o próprio usuário.');
      this.exceptionUser.toggle();

      return;
    }else{
        try {
            this.userService.deleteUser(userId); // Chama o serviço para deletar o usuário
            this.users = this.users.filter(user => user.id !== userId); // Atualiza a lista de usuários removendo o usuário deletado
          }catch (error) {
            console.error('Erro ao deletar usuário:', error);
          }
    }
  }
   
  }

  // Método para redirecionar para a página de edição de usuário
  EditUser(id: number): void {
    // Redireciona para a rota de edição de usuário
    this.router.navigate(['manage/edit/user', id]);


  }
}