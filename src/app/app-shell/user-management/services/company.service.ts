import { Injectable } from '@angular/core';
import { HttpService } from '../../framework-services/http.service';
import { ServiceBase } from '../../framework-services/service.base';

@Injectable({
    providedIn: 'root'
})
export class CompanyService extends ServiceBase {

    constructor(override readonly httpService: HttpService) {
        super("Company", httpService, 'um');
    }

    getForChart(searchModel: any) {
        const path = `${this.baseUrl}/GetForChart`;
        return this.httpService.getWithParams<any>(path, searchModel, true);
    }

    getForAdminCombo() {
        const path = `${this.baseUrl}/GetForAdminCombo`;
        return this.httpService.getAll<any>(path, true);
    }

    getByGuid(guid) {
        const path = `${this.baseUrl}/GetByGuid`;
        return this.httpService.get<any>(path, guid, true);
    }
}
