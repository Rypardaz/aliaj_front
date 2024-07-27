import { Injectable } from '@angular/core';
import { HttpService } from '../../framework-services/http.service';
import { ServiceBase } from '../../framework-services/service.base';

@Injectable({
    providedIn: 'root'
})
export class OrganizationChartService extends ServiceBase {

    constructor(override readonly httpService: HttpService) {
        super("OrganizationChart", httpService, 'um');
    }

    getForTree(searchModel: any) {
        const path = `${this.baseUrl}/GetForTree`;
        return this.httpService.getWithParams<any>(path, searchModel, true);
    }

    getForChart(searchModel: any) {
        const path = `${this.baseUrl}/GetForChart`;
        return this.httpService.getWithParams<any>(path, searchModel, true);
    }

    changeParent(command) {
        const path = `${this.baseUrl}/ChangeParent`;
        return this.httpService.put(path, command, true);
    }
}
