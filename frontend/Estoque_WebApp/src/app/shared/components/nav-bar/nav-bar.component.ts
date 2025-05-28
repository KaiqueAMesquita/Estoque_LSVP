import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconModule, icons } from '../../modules/icon/icon.module';

@Component({
  // 'selector' só nomeia o componente pra ficar mais fácil de saber quem é o que
  selector: 'app-nav-bar',
  // 'standalone' fala que o componente é independente e não precisa de um módulo
  standalone: true,
  // 'imports' só importa as coisas que o componente precisa
  imports: [CommonModule, RouterModule, FontAwesomeModule, IconModule],
  // Link do template
  templateUrl: './nav-bar.component.html',
  // Link do css
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {
  // 'icons' é o objeto que contém todos os ícones importados do módulo
  icons = icons;

  // Aquela barrinha branca inferior que mostra o que tá ativa
  activeMenu: string = 'produtos';
  // TODO: tem que ajustar isso pra ela não ficar "roubando" os outros.
  
  // 'setActive' define qual menu está ativo
  setActive(menu: string) {
    this.activeMenu = menu;
  }

  // 'isActive' verifica se o menu está ativo
  isActive(menu: string): boolean {
    return this.activeMenu === menu;
  }
}
