import { Injectable } from "@angular/core";
import { ServiceBase } from "../../framework-services/service.base";
import { HttpService } from "../../framework-services/http.service";

@Injectable({
  providedIn: 'root'
})
export class ReportService extends ServiceBase {

  constructor(httpService: HttpService) {
    super("Report", httpService)
  }

  getActivityNames(salonGuid) {
    const path = `${this.baseUrl}/GetActivityNames`
    return this.httpService.get<any>(path, salonGuid)
  }

  getMachineDailyRecordReport(searchModel) {
    const path = `${this.baseUrl}/GetMachineDailyRecordReport`
    return this.httpService.getWithParams<any>(path, searchModel)
  }

  getWireTypeConsumptionReport(searchModel) {
    const path = `${this.baseUrl}/GetWireTypeConsumptionReport`
    return this.httpService.getWithParams<any>(path, searchModel)
  }

  getActivityReport(searchModel) {
    const path = `${this.baseUrl}/GetActivityReport`
    return this.httpService.getWithParams<any>(path, searchModel)
  }

  getByPartReport(searchModel) {
    const path = `${this.baseUrl}/GetByPartReport`
    return this.httpService.getWithParams<any>(path, searchModel)
  }

  getProjectReport(searchModel) {
    const path = `${this.baseUrl}/GetProjectReport`
    return this.httpService.getWithParams<any>(path, searchModel)
  }

  getPersonnelReport(searchModel) {
    const path = `${this.baseUrl}/GetPersonnelReport`
    return this.httpService.getWithParams<any>(path, searchModel)
  }
}