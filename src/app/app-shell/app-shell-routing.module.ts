import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { AppShellComponent } from './app-shell.component';
import { authGuard } from './framework-services/auth.guard.service';

const routes: Routes = [
  {
    path: '',
    component: AppShellComponent,
    canActivate: [
      authGuard,
      // sessionGuard 
    ],
    runGuardsAndResolvers: 'always',
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'dashboard/:type', component: DashboardComponent },
      {
        path: 'basic-info',
        loadChildren: () =>
          import('./basic-info/basic-info.module')
            .then(x => x.BasicInfoModule)
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

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppShellRoutingModule { }
