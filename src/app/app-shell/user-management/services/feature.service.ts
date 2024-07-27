import { Injectable } from '@angular/core';
import { HttpService } from '../../framework-services/http.service';
import { ServiceBase } from '../../framework-services/service.base';

@Injectable({
  providedIn: 'root'
})
export class FeatureService extends ServiceBase {

  constructor(httpService: HttpService) {
    super("Feature", httpService, 'um');
  }

  updateClassificationLevel(command) {
    return this.httpService.post<any>(`${this.baseUrl}/UpdateClassificationLevel`, command);
  }

  getUserPermissions() {
    return this.httpService.getAll<any>(`${this.baseUrl}/GetUserPermissions`);
  }

  getTileFeatures(userGroupId) {
    return this.httpService.getAll<any>(`${this.baseUrl}/GetTileFeatures/${userGroupId}`);
  }

  getUserTiles(userId) {
    return this.httpService.getAll<any>(`${this.baseUrl}/GetUserTiles/${userId}`);
  }

  getAllReportFeatures() {
    return this.httpService.getAll<any>(`${this.baseUrl}/GetAllReportFeatures`);
  }

  getForClassificationLevel() {
    return this.httpService.getAll<any>(`${this.baseUrl}/getForClassificationLevel`);
  }

  getClassificationLevelByTitle(searchModel) {
    return this.httpService.getWithParams<any>(`${this.baseUrl}/getClassificationLevelByTitle`, searchModel);
  }
}