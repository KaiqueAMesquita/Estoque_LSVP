import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ManageLayoutComponent } from './shared/layouts/manage-layout/manage-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { loginGuard } from './core/guards/login.guard';
import { UsersViewComponent } from './pages/user/users-view/users-view.component';
import { ManageViewComponent } from './pages/manage-view/manage-view.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EmptyComponentComponent } from './shared/components/empty-component/empty-component.component';
import { CreateUserComponent } from './pages/user/create-user/create-user.component';
import { EditUserComponent } from './pages/user/edit-user/edit-user.component';
import { EditProductsComponent } from './pages/products/edit-products/edit-products.component';
import { ViewProductsComponent } from './pages/products/view-products/view-products.component';
import { CreateProductsComponent } from './pages/products/create-products/create-products.component';
import { CreateContainerComponent } from './pages/container/create-container/create-container.component';

export const routes: Routes = [
    //[authGuard] protege as rotas que precisam de autenticação
    //[loginGuard] protege as rotas que não devem ser acessadas se o usuário já estiver logado

    
   { path: 'login', component: LoginComponent, canActivate: [loginGuard] }, //rota de login
   {path: '', redirectTo: 'dashboard', pathMatch: 'full' }, //rota padrão redireciona para o dashboard
   {path: 'dashboard', component: DashboardComponent, pathMatch: 'full', canActivate: [authGuard] }, //rota do dashboard
   //rotas de gerenciamento 
   { path: 'manage', component: ManageLayoutComponent,
    //filhos da rota de gerenciamento
        children: [
            {path: '', redirectTo: 'view', pathMatch: 'full'},
            {path: 'view', component: ManageViewComponent, pathMatch: 'full', canActivate: [authGuard] },
            {path: 'view/users', component: UsersViewComponent, pathMatch: 'full', canActivate: [authGuard] },
            {path: 'create/user', component: CreateUserComponent, pathMatch: 'full', canActivate: [authGuard] },
            {path: 'edit/user/:id', component: EditUserComponent, pathMatch: 'full', canActivate: [authGuard] },

            {path: 'view/products', component: ViewProductsComponent, pathMatch: 'full', canActivate: [authGuard] },
            {path: 'create/products', component: CreateProductsComponent, pathMatch: 'full', canActivate: [authGuard] },
            {path: 'edit/products/:id', component: EditProductsComponent, pathMatch: 'full', canActivate: [authGuard] },

            {path: 'create/container', component: CreateContainerComponent, pathMatch: 'full', canActivate: [authGuard] },


        ],
     },
    
];

