import { Injectable } from "@angular/core"
import { HttpService } from "../../framework-services/http.service"
import { ServiceBase } from "../../framework-services/service.base"

@Injectable({
  providedIn: 'root'
})
export class ProjectDossierService extends ServiceBase {

  constructor(httpService: HttpService) {
    super("ProjectDossier", httpService)
  }

  editInquiryInformation(searchModel) {
    const path = `${this.baseUrl}/EditInquiryInformation`
    return this.httpService.put(path, searchModel)
  }
}