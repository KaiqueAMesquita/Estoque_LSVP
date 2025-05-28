import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ManageLayoutComponent } from './shared/layouts/manage-layout/manage-layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [

        
    { path: 'login', component: LoginComponent },
    { path: 'manage', component: ManageLayoutComponent, canActivate: [authGuard] },
    

];
