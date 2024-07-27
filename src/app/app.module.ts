import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppShellModule } from './app-shell/app-shell.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpService } from './app-shell/framework-services/http.service';
import { BrowserModule } from '@angular/platform-browser';
import { ExceptionInterceptor } from './app-shell/framework-services/exception.interceptor.service';
import { NotificationService } from './app-shell/framework-services/notification.service';
import { SecurityInterceptor } from './app-shell/framework-services/security.interceptor.service';
import { PasswordFlowService } from './app-shell/framework-services/password-flow.service';
import { LoaderInterceptor } from './app-shell/framework-services/loader.interceptor.service';
import { ToastrService } from 'ngx-toastr';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    AppShellModule,
    AuthenticationModule
  ],
  exports: [
  ],
  providers: [
    HttpService,
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: ValidationInterceptor,
    //   multi: true
    // },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ExceptionInterceptor,
      multi: true,
      deps: [ToastrService]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SecurityInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true
    },
  ],
  // providers: [TaskService],
  bootstrap: [AppComponent]
})
export class AppModule { }
