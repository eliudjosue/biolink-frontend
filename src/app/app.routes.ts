import { Routes } from '@angular/router';
import { authGuardGuard } from './core/guard/auth-guard.guard';
import { rootRedirectGuard } from './core/guard/rootRedirect/root-redirect.guard';
import { MainLayoutComponent } from './layouts/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        canActivate: [rootRedirectGuard],
        loadComponent: () =>
          import('./features/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'login',
        canActivate: [rootRedirectGuard],
        loadComponent: () =>
          import('./features/login/login-component.component').then(
            (m) => m.LoginComponentComponent
          ),
      },
      {
        path: 'register',
        canActivate: [rootRedirectGuard],
        loadComponent: () =>
          import('./features/register/register-component.component').then(
            (m) => m.RegisterComponentComponent
          ),
      },
      {
        path: 'dashboard',
        canActivate: [authGuardGuard],
        loadComponent: () =>
          import('./features/dashboard/dashboard-component.component').then(
            (m) => m.DashboardComponentComponent
          ),
      },
      {
        path: ':username',
        loadComponent: () => import('./features/public-profile/public-profile.component').then((m) => m.PublicProfileComponent),
      },
      {
        path: '**',
        redirectTo: 'home',
      },
    ],
  },
];
