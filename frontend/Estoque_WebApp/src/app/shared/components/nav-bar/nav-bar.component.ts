import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconModule, icons } from '../../modules/icon/icon.module';
import { AuthenticationService } from '../../../core/authentication/authentication.service';
import { filter } from 'rxjs';

@Component({
  // 'selector' só nomeia o componente pra ficar mais fácil de saber quem é o que
  selector: 'app-nav-bar',
  // 'standalone' fala que o componente é independente e não precisa de um módulo
  standalone: true,
  // 'imports' importa as coisas que o componente precisa
  imports: [CommonModule, RouterModule, FontAwesomeModule, IconModule],
  // Link do template
  templateUrl: './nav-bar.component.html',
  // Link do css
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {

  userName: string = '';
  
  constructor(private auth: AuthenticationService, private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.setActiveByRoute(event.urlAfterRedirects);
      });
    this.userName = this.auth.getUserName();
  }
  // 'icons' é o objeto que contém todos os ícones importados do módulo
  icons = icons;

  // 'hasRole' verifica se o usuário tem um papel específico
  hasRole(role: string): boolean {
    return this.auth.getToken() === role;
  }

  // 'showDropdown' controla a visibilidade do dropdown de produtos
  showDropdown = false;

  // Aquela barrinha branca inferior que mostra o que tá ativa
  activeMenu: string = '';

  // Quando a página muda, ela redefinia o valor sempre para '', 
  // então, troquei pra força bruta com essa função. XD
  // Só acrescentar mais rotas ou opções aqui
  setActiveByRoute(url: string) {
    if (url.includes('dashboard')) {
      this.activeMenu = 'home';
    } else if (url.includes('manage/view/products')) {
      this.activeMenu = 'produtos';
    } else if (url.includes('manage/view/category')) {
      this.activeMenu = 'categorias';
    } else if (url.includes('manage')) {
      this.activeMenu = 'gestao';
    } else if (url.includes('relatorios')) {
      this.activeMenu = 'relatorios';
    }
  }

  // 'isActive' verifica se o menu está ativo
  isActive(menu: string): boolean {
    return this.activeMenu === menu;
  }


  logout(){
    // Chama o serviço de autenticação para fazer o logout
    this.auth.logout();
    window.location.href = '/login';
  }
}
