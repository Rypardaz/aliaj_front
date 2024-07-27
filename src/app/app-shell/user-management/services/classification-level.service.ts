import { Injectable } from '@angular/core';
import { HttpService } from '../../framework-services/http.service';
import { ServiceBase } from '../../framework-services/service.base';

@Injectable({
    providedIn: 'root'
})
export class ClassificationLevelService extends ServiceBase {

    constructor(override readonly httpService: HttpService) {
        super("ClassificationLevel", httpService, 'um');
    }
}