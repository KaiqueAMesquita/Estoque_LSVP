import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconModule, icons } from '../../modules/icon/icon.module';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule, IconModule],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {
  // Usando o objeto icons diretamente importado do módulo
  icons = icons;

  // Aquela barrinha que mostra o que tá ativo
  activeMenu: string = 'produtos';
  
  setActive(menu: string) {
    this.activeMenu = menu;
  }

  isActive(menu: string): boolean {
    return this.activeMenu === menu;
  }
}
