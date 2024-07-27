import { Injectable } from '@angular/core';
import { HttpService } from '../../framework-services/http.service';
import { ServiceBase } from '../../framework-services/service.base';

@Injectable({
    providedIn: 'root'
})
export class OperationLogService extends ServiceBase {

    constructor(httpService: HttpService) {
        super("OperationLog", httpService, 'um');
    }

    getOperationLog(searchModel) {
        let path = `${this.baseUrl}/GetList`;
        return this.httpService.put(path, searchModel);
    }
}