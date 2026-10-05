import { importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withHashLocation } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { HotkeyModule } from 'angular2-hotkeys';
import { AppComponent } from './app/app.component';
import { APP_ROUTES } from './app/app-shell/app.routes';
import { HttpService } from './app/app-shell/framework-services/http.service';
import { ExceptionInterceptor } from './app/app-shell/framework-services/exception.interceptor.service';
import { SecurityInterceptor } from './app/app-shell/framework-services/security.interceptor.service';
import { LoaderInterceptor } from './app/app-shell/framework-services/loader.interceptor.service';
import { PasswordFlowService } from './app/app-shell/framework-services/password-flow.service';
import { LocalStorageService } from './app/app-shell/framework-services/local.storage.service';
import { SettingService } from './app/app-shell/framework-services/setting.service';
import { NotificationService } from './app/app-shell/framework-services/notification.service';
import { SwalService } from './app/app-shell/framework-services/swal.service';

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(),
    provideRouter(APP_ROUTES, withHashLocation()),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(
      ToastrModule.forRoot(),
      HotkeyModule.forRoot()
    ),
    provideEnvironmentNgxMask(),
    HttpService,
    PasswordFlowService,
    LocalStorageService,
    SettingService,
    NotificationService,
    SwalService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ExceptionInterceptor,
      multi: true,
      deps: [ToastrService]
    },
    { provide: HTTP_INTERCEPTORS, useClass: SecurityInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true }
  ]
}).catch(err => console.error(err));
