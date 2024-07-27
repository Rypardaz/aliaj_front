import { Injectable } from '@angular/core'
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { ToastrService } from 'ngx-toastr'
declare var $: any

@Injectable()
export class ExceptionInterceptor implements HttpInterceptor {
  static toastr

  constructor(toastr: ToastrService) {
    ExceptionInterceptor.toastr = toastr
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(ExceptionInterceptor.handleError))
  }

  static handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
    } else {
      if (error.status === 400) {
        if (error.error.error == "invalid_client") {
          ExceptionInterceptor.toastr.error(error.error.error_description, "خطای ورود")

          $("#loginBtn").attr("disabled", false)
          $("#loginBtnSpinner").addClass("d-none")

          throw new Error("")
        }

        ExceptionInterceptor.toastr.error("اطلاعات فرم به درستی وارد نشده است.", "خطا فرم")

      } else if (error.status == 500) {
        console.log(error)
        ExceptionInterceptor.toastr.error('خطایی رخ داده است. لطفا با مدیر سیستم تماس بگیرید', "خطا سرور")
      } else if (error.status == 410) {
        console.log(error)
        ExceptionInterceptor.toastr.error(error.error, 'خطا')
      }
    }

    return throwError(
      'مشکلی رخ داده است. لطفا مجددا تلاش نمایید. در صورتی که مشکل حل نشد، با مدیر سیستم تماس بگیرید.')
  }
}
