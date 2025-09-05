import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../core/authentication/authentication.service';
import { IconModule, icons } from '../../shared/modules/icon/icon.module';

@Component({
  selector: 'app-manage-view',
  imports: [IconModule],
  templateUrl: './manage-view.component.html',
  styleUrl: './manage-view.component.css'
})
export class ManageViewComponent {
  icons = icons; //importando os ícones do módulo IconModule

  constructor(private router:Router, private auth:AuthenticationService){
  }

  // Método para navegar para a página de gerenciamento de usuários
  navigateToUser(): void{
    this.router.navigate(['/manage/view/users']);

  }
  navigateToProducts(): void{
    this.router.navigate(['/manage/view/products']);

  }
  navigateToContainers(): void{
    this.router.navigate(['/manage/view/container']);
  }


}
