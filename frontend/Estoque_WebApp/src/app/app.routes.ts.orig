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
import { ViewMovementsComponent } from './pages/movements/view/view-movements.component';
import { EditMovementsComponent } from './pages/movements/edit/edit-movements.component';
import { MovementInputComponent } from './pages/movements/movement-input/movement-input.component';
import { ScannerInputComponent } from './pages/movements/scanner-input/scanner-input.component';
import { CookDashboardComponent } from './pages/cook-dashboard/cook-dashboard.component';
import { KitchenOrderComponent } from './pages/request/kitchen-order/kitchen-order.component';

export const routes: Routes = [
    //[authGuard] protege as rotas que precisam de autenticação
    //[authGuard] protege as rotas que não devem ser acessadas se o usuário já estiver logado
   { path: 'teste', component: UnitInputComponent }, // }, //rota de login
   { path: 'login', component: LoginComponent }, // }, //rota de login
   {path: '', redirectTo: 'dashboard', pathMatch: 'full', /*canActivate:[loginGuard]*/ }, //rota padrão redireciona para o dashboard
   {path: 'dashboard', component: DashboardComponent, pathMatch: 'full', canActivate:[authGuard] }, // }, //rota do dashboard
   //rotas de gerenciamento 
   { path: 'manage', component: ManageLayoutComponent,
    //filhos da rota de gerenciamento
        children: [
            {path: '', redirectTo: 'view', pathMatch: 'full'},
            {path: 'view', component: ManageViewComponent, pathMatch: 'full', /*canActivate:[authGuard]*/},
            {path: 'view/users', component: UsersViewComponent, pathMatch: 'full', /*canActivate:[authGuard]*/},
            {path: 'create/user', component: CreateUserComponent, pathMatch: 'full', /*canActivate:[adminGuard]},*/ },
            {path: 'edit/user/:id', component: EditUserComponent, pathMatch: 'full', /*canActivate:[adminGuard]},*/ },

            {path: 'view/products', component: ViewProductsComponent, pathMatch: 'full', /*canActivate:[authGuard]*/},
            {path: 'create/product', component: CreateProductsComponent, pathMatch: 'full', /*canActivate:[authGuard]*/},
            {path: 'edit/products/:id', component: EditProductsComponent, pathMatch: 'full', /*canActivate:[authGuard]*/},

            {path: 'view/containers', component: ViewContainersComponent, pathMatch: 'full', /*canActivate:[authGuard]*/},
            {path: 'create/container', component: CreateContainerComponent, pathMatch: 'full', /*canActivate:[authGuard]*/},
            {path: 'edit/container/:id', component: EditContainerComponent, pathMatch: 'full', /*canActivate:[authGuard]*/},

            {path: 'view/categories', component: ViewCategoriesComponent, pathMatch: 'full', /*canActivate:[authGuard]*/},
            {path: 'create/category', component: CreateCategoryComponent, pathMatch: 'full', /*canActivate:[authGuard]*/ },
            {path: 'edit/category/:id', component: EditCategoryComponent, pathMatch: 'full', /*canActivate:[authGuard]*/},

            {path: 'view/movements', component: ViewMovementsComponent, pathMatch: 'full', /*canActivate:[authGuard]*/},
            {path: 'edit/movements/:id', component: EditMovementsComponent, pathMatch: 'full', /*canActivate:[authGuard]*/},
            {path: 'movements/scan', component: ScannerInputComponent, pathMatch: 'full', /*canActivate:[authGuard]*/},
            {path: 'movements/input', component: MovementInputComponent, pathMatch: 'full', /*canActivate:[authGuard]*/}

        ], /*//*/
     },
    { path:'**', component: The404PageComponent, pathMatch: 'full' }, //A ** redireciona para o Componente da 404!
];

