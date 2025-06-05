import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ManageLayoutComponent } from './shared/layouts/manage-layout/manage-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { UsersViewComponent } from './pages/user/users-view/users-view.component';
import { ManageViewComponent } from './pages/manage-view/manage-view.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
   { path: 'login', component: LoginComponent },
    {path: '', component: DashboardComponent, pathMatch: 'full'},
    { path: 'manage', component: ManageLayoutComponent,
        children: [
            {path: '', redirectTo: 'view', pathMatch: 'full'},
            {path: 'view', component: ManageViewComponent, pathMatch: 'full', canActivate: [authGuard] },
            {path: 'view/users', component: UsersViewComponent, pathMatch: 'full', canActivate: [authGuard] },
        ],
     },
    

];
