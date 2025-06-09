import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ManageLayoutComponent } from './shared/layouts/manage-layout/manage-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { loginGuard } from './core/guards/login.guard';
import { UsersViewComponent } from './pages/user/users-view/users-view.component';
import { ManageViewComponent } from './pages/manage-view/manage-view.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
    //[authGuard] protege as rotas que precisam de autenticação
    //[loginGuard] protege as rotas que não devem ser acessadas se o usuário já estiver logado

   { path: 'login', component: LoginComponent, canActivate: [loginGuard] }, //rota de login
   {path: '', redirectTo: 'dashboard', pathMatch: 'full', canActivate: [authGuard] }, //rota padrão redireciona para o dashboard
   {path: 'dashboard', component: DashboardComponent, pathMatch: 'full', canActivate: [authGuard] }, //rota do dashboard
   //rotas de gerenciamento 
   { path: 'manage', component: ManageLayoutComponent,
    //filhos da rota de gerenciamento
        children: [
            {path: '', redirectTo: 'view', pathMatch: 'full'}, //rota padrão de gerenciamento redireciona para a view
            {path: 'view', component: ManageViewComponent, pathMatch: 'full', canActivate: [authGuard] },//rota de gerenciamento view
            {path: 'view/users', component: UsersViewComponent, pathMatch: 'full', canActivate: [authGuard] },//rota de gerenciamento de usuários
            // Adicionar outras rotas de gerenciamento aqui
        ],
     },
    

];
