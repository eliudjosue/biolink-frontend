import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout.component';
import { authGuardGuard } from './core/guard/auth-guard.guard';

export const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            {
                path: 'login',
                loadComponent: () => import('./features/login/login-component.component').then(m => m.LoginComponentComponent)
            },
            {
                path: 'register',
                loadComponent: () => import('./features/register/register-component.component').then(m => m.RegisterComponentComponent)
            },
            {
                path: 'dashboard',
                canActivate: [authGuardGuard],
                loadComponent: () => import('./features/dashboard/dashboard-component.component').then(m => m.DashboardComponentComponent)
            },
            // {
            //     path: '**',
            //     redirectTo: ''
            // }
        ]
    }
];
