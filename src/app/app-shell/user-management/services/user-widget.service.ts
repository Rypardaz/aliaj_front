import { Injectable } from '@angular/core';
import { HttpService } from '../../framework-services/http.service';
import { ServiceBase } from '../../framework-services/service.base';

@Injectable({
  providedIn: 'root'
})
export class UserWidgetService extends ServiceBase {

  constructor(httpService: HttpService) {
    super("UserWidget", httpService, 'um');
  }
}
