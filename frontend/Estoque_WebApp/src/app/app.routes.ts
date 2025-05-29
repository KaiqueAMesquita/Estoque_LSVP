import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ManageLayoutComponent } from './shared/layouts/manage-layout/manage-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { UsersViewComponent } from './pages/user/users-view/users-view.component';

export const routes: Routes = [
    /*Adicionar novas rotas aqui*/
    { path: 'login', component: LoginComponent },
    { path: 'manage', component: ManageLayoutComponent,
        children: [
            {path: 'view/users', component: UsersViewComponent, pathMatch: 'full'},
        ]
     },
    

];
