import { Injectable } from "@angular/core";
import { ServiceBase } from "../../framework-services/service.base";
import { HttpService } from "../../framework-services/http.service";

@Injectable({
  providedIn: 'root'
})
export class ProjectService extends ServiceBase {

  constructor(httpService: HttpService) {
    super("Project", httpService)
  }

  getProjects(searchModel) {
    const path = `${this.baseUrl}/GetList`
    return this.httpService.getWithParams<any>(path, searchModel)
  }

  detailsCombo(salonGuid) {
    const path = `${this.baseUrl}/DetailsCombo`
    return this.httpService.get<[]>(path, salonGuid)
  }
}