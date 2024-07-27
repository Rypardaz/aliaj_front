import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { PasswordFlowService } from "./password-flow.service";
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { CodeFlowService } from './code-flow.service';
import { environment } from 'src/environment/environment';

@Injectable()
export class SecurityInterceptor implements HttpInterceptor {
  constructor(
    private readonly codeFlowService: CodeFlowService,
    private readonly passwordFlowService: PasswordFlowService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.headers.has('skip'))
      return next.handle(request)

    let token = ''
    if (environment.ssoAuthenticationFlow = 'code') {
      token = this.codeFlowService.getToken()
      if (!token)
        this.codeFlowService.logout();
    }
    else {
      token = this.passwordFlowService.getToken();
      if (!token)
        this.passwordFlowService.logout();
    }

    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      },
      responseType: 'json'
    });

    return next.handle(request).pipe(tap(
      {
        next: event => {
          if (event instanceof HttpResponse) { }
        },
        error: err => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401 ||
              err.status === 402 ||
              err.status === 403) {

              if (environment.ssoAuthenticationFlow = 'code')
                this.codeFlowService.logout()
              else
                this.passwordFlowService.logout();

            }
          }
        }
      }
    ));
  }
}
