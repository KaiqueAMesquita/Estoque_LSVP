import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faHome, 
  faBuilding, 
  faBox, 
  faList, 
  faChartLine 
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {
  // Icons
  faHome = faHome;
  faBuilding = faBuilding;
  faBox = faBox;
  faList = faList;
  faChartLine = faChartLine;
  
  // Active menu item
  activeMenu: string = 'produtos';
  
  // Set active menu
  setActive(menu: string) {
    this.activeMenu = menu;
  }
  
  // Check if menu is active
  isActive(menu: string): boolean {
    return this.activeMenu === menu;
  }
}
