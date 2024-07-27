import { Injectable } from '@angular/core';
import { HttpService } from '../../framework-services/http.service';
import { ServiceBase } from '../../framework-services/service.base';

@Injectable({
  providedIn: 'root'
})
export class UserGroupService extends ServiceBase {

  constructor(httpService: HttpService) {
    super("UserGroup", httpService, 'um');
  }

  getForPartyCombo() {
    const path = `${this.baseUrl}/GetForPartyCombo`;
    return this.httpService.getAll<any>(path);
  }
}
