import { Injectable } from '@angular/core';
import { operationSuccessful } from '../framework-components/app-messages';
import { ToastrService } from 'ngx-toastr';
declare var $: any;

@Injectable()
export class NotificationService {
    constructor(private toastr: ToastrService) {

    }

    succeded(message: string = operationSuccessful) {
        this.toastr.success(message, "موفقیت")
    }

    info(message: string) {
        this.toastr.info(message, "توجه")
    }

    error(message: string, title = "خطا") {
        this.toastr.error(message, title)
    }
}

