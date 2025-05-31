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
  icons = icons;
  
  constructor(private router:Router, private auth:AuthenticationService){}

  navigateToUser(): void{
    this.router.navigate(['/manage/view/users']);

  }

}
