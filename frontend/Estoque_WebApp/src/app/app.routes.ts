import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ManageLayoutComponent } from './shared/layouts/manage-layout/manage-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { UsersViewComponent } from './pages/user/users-view/users-view.component';
import { ManageViewComponent } from './pages/manage-view/manage-view.component';
import { FormComponent } from './shared/components/form/form.component';
import { Form2Component } from './shared/components/form2/form2.component';

export const routes: Routes = [
    /*Adicionar novas rotas aqui*/
    { path: 'form', component: FormComponent},
    { path: 'form2', component: Form2Component},
    { path: 'login', component: LoginComponent },
    { path: 'manage', component: ManageLayoutComponent,
        children: [
            {path: '', redirectTo: 'view', pathMatch: 'full'},
            {path: 'view', component: ManageViewComponent, pathMatch: 'full'},
            {path: 'view/users', component: UsersViewComponent, pathMatch: 'full', canActivate: [authGuard] },
        ],
     },
    

];
