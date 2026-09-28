import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { inject, Injectable } from '@angular/core'
import { environment } from 'src/environment/environment'
import { UserService } from '../basic-info/user/user.service'
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse } from '@angular/common/http'

@Injectable()
export class SecurityInterceptor implements HttpInterceptor {
  userService = inject(UserService)

  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.headers.has('skip'))
      return next.handle(request)

    let token = ''
    token = this.userService.getToken()
    if (!token)
      this.userService.logout()

    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      },
      responseType: 'json'
    })

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
                this.userService.logout()
            }
          }
        }
      }
    ))
  }
}
