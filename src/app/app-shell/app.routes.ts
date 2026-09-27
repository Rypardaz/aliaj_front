import { DashboardComponent } from './dashboard/dashboard.component';
import { Routes } from '@angular/router';
import { AppShellComponent } from './app-shell.component';
import { authGuard } from './framework-services/auth.guard.service';
import { LoginComponent } from './login/login.component';

export const APP_ROUTES: Routes = [
  {
    path: '',
    component: AppShellComponent,
    canActivate: [
      authGuard
    ],
    runGuardsAndResolvers: 'always',
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'dashboard/:type', component: DashboardComponent },
      {
        path: 'basic-info',
        loadChildren: () =>
          import('./basic-info/basic-info.routes')
            .then(x => x.BASIC_INFO_ROUTES)
      }
    ]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    redirectTo: 'error/404',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'error/404',
    pathMatch: 'full'
  },
]

