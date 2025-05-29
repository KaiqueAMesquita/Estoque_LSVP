import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ManageLayoutComponent } from './shared/layouts/manage-layout/manage-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { UserTableComponent } from './shared/components/user-table/user-table.component';

export const routes: Routes = [
    /*Adicionar novas rotas aqui*/
    { path: 'user', component: UserTableComponent},    
    { path: 'login', component: LoginComponent },
    { path: 'manage', component: ManageLayoutComponent, canActivate: [authGuard] },
    

];
