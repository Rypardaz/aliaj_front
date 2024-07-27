import { NgModule } from '@angular/core';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppShellComponent } from './app-shell.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppShellRoutingModule } from './app-shell-routing.module';
import { PhoenixFrameworkModule } from './framework-components/framework.module';
import { PasswordFlowService } from './framework-services/password-flow.service';
import { LocalStorageService } from './framework-services/local.storage.service';
import { IdentityService } from './framework-services/identity.service';
import { SettingService } from './framework-services/setting.service';
import { NotificationService } from './framework-services/notification.service';
import { SwalService } from './framework-services/swal.service';
import { HttpService } from './framework-services/http.service';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { PasswordStrengthMeterModule } from 'angular-password-strength-meter';
import { DEFAULT_PSM_OPTIONS } from 'angular-password-strength-meter/zxcvbn';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppShellRoutingModule,
    PhoenixFrameworkModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    PasswordStrengthMeterModule.forRoot(DEFAULT_PSM_OPTIONS),
    NgSelectModule
  ],
  declarations: [
    AppShellComponent,
    SidebarComponent,
    HeaderComponent,
    FooterComponent,
    DashboardComponent,
    BreadcrumbComponent,
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    PasswordFlowService,
    LocalStorageService,
    IdentityService,
    SettingService,
    NotificationService,
    SwalService,
    HttpService
  ]
})
export class AppShellModule { }
