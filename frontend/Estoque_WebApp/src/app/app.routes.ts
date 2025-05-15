import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ManageLayoutComponent } from './shared/layouts/manage-layout/manage-layout.component';
import { UTableComponent } from './shared/components/u-table/u-table.component';
export const routes: Routes = [
    {path: 'user', component: UTableComponent},
    {path: 'manage', component: ManageLayoutComponent},
    {path: 'login', component: LoginComponent },
];
