import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ManageLayoutComponent } from './shared/layouts/manage-layout/manage-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { loginGuard } from './core/guards/login.guard';
import { UsersViewComponent } from './pages/user/users-view/users-view.component';
import { ManageViewComponent } from './pages/manage-view/manage-view.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CreateUserComponent } from './pages/user/create-user/create-user.component';
import { EditUserComponent } from './pages/user/edit-user/edit-user.component';
import { EditProductsComponent } from './pages/products/edit-products/edit-products.component';
import { ViewProductsComponent } from './pages/products/view-products/view-products.component';
import { CreateProductsComponent } from './pages/products/create-products/create-products.component';
import { CreateContainerComponent } from './pages/container/create-container/create-container.component';
import { ViewContainersComponent } from './pages/container/view-containers/view-containers.component';
import { The404PageComponent } from './shared/components/the404-page/the404-page.component';
import { TesteComponent } from './teste/teste.component';
import { UnitInputComponent } from './pages/unit/unit-input/unit-input.component';
import { EditContainerComponent } from './pages/container/edit-container/edit-container.component';
import { CreateCategoryComponent } from './pages/category/create-category/create-category.component';
import { ViewCategoriesComponent } from './pages/category/view-categories/view-categories.component';
import { EditCategoryComponent } from './pages/category/edit-category/edit-category.component';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
    //[authGuard] protege as rotas que precisam de autenticação
    //[loginGuard] protege as rotas que não devem ser acessadas se o usuário já estiver logado
   { path: 'teste', component: UnitInputComponent, canActivate: [authGuard] }, //rota de login
   { path: 'login', component: LoginComponent, canActivate: [loginGuard] }, //rota de login
   {path: '', redirectTo: 'dashboard', pathMatch: 'full' }, //rota padrão redireciona para o dashboard
   {path: 'dashboard', component: DashboardComponent, pathMatch: 'full', canActivate: [authGuard] }, //rota do dashboard
   //rotas de gerenciamento 
   { path: 'manage', component: ManageLayoutComponent,
    //filhos da rota de gerenciamento
        children: [
            {path: '', redirectTo: 'view', pathMatch: 'full'},
            {path: 'view', component: ManageViewComponent, pathMatch: 'full'},
            {path: 'view/users', component: UsersViewComponent, pathMatch: 'full', canActivate: [adminGuard] },
            {path: 'create/user', component: CreateUserComponent, pathMatch: 'full', canActivate: [adminGuard] },
            {path: 'edit/user/:id', component: EditUserComponent, pathMatch: 'full', canActivate: [adminGuard] },

            {path: 'view/products', component: ViewProductsComponent, pathMatch: 'full'},
            {path: 'create/products', component: CreateProductsComponent, pathMatch: 'full'},
            {path: 'edit/products/:id', component: EditProductsComponent, pathMatch: 'full'},

            {path: 'create/container', component: CreateContainerComponent, pathMatch: 'full'},
            {path: 'view/containers', component: ViewContainersComponent, pathMatch: 'full'},
            {path: 'edit/container/:id', component: EditContainerComponent, pathMatch: 'full'},

            {path: 'create/category', component: CreateCategoryComponent, pathMatch: 'full' },
            {path: 'view/categories', component: ViewCategoriesComponent, pathMatch: 'full'},
            {path: 'edit/category/:id', component: EditCategoryComponent, pathMatch: 'full'},

        ], /*canActivate: [authGuard]*/
     },
    { path:'**', component: The404PageComponent, pathMatch: 'full' }, //A ** redireciona para o Componente da 404!
];

