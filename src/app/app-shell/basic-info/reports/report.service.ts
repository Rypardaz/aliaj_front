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

  getDailyRecordReport(searchModel) {
    const path = `${this.baseUrl}/GetDailyRecordReport`
    return this.httpService.put(path, searchModel)
  }

  getWireTypeConsumptionReport(searchModel) {
    const path = `${this.baseUrl}/GetWireTypeConsumptionReport`
    return this.httpService.put(path, searchModel)
  }

  getActivityNamesForActivityReport(salonGuid) {
    const path = `${this.baseUrl}/GetActivityNamesForActivityReport`
    return this.httpService.get<any>(path, salonGuid)
  }

  getActivityReport(searchModel) {
    const path = `${this.baseUrl}/GetActivityReport`
    return this.httpService.put(path, searchModel)
  }

  getByPartReport(searchModel) {
    const path = `${this.baseUrl}/GetByPartReport`
    return this.httpService.getWithParams<any>(path, searchModel)
  }

  getProjectWireTypes(searchModel) {
    const path = `${this.baseUrl}/GetProjectWireTypes`
    return this.httpService.put(path, searchModel)
  }

  getProjectReport(searchModel) {
    const path = `${this.baseUrl}/GetProjectReport`
    return this.httpService.put(path, searchModel)
  }

  getPersonnelReport(searchModel) {
    const path = `${this.baseUrl}/GetPersonnelReport`
    return this.httpService.put(path, searchModel)
  }

  getDataLoggerReport(searchModel) {
    const path = `${this.baseUrl}/GetDataLoggerReport`
    return this.httpService.put(path, searchModel)
  }

  getWeldingTimeReport(searchModel) {
    const path = `${this.baseUrl}/GetWeldingTimeReport`
    return this.httpService.put(path, searchModel)
  }

  getActivityNamesForMachineReport(salonGuid) {
    const path = `${this.baseUrl}/GetActivityNamesForMachineReport`
    return this.httpService.get<any>(path, salonGuid)
  }

  getMachineReport(searchModel) {
    const path = `${this.baseUrl}/GetMachineReport`
    return this.httpService.put(path, searchModel)
  }

  getFinalCardProject(searchModel) {
    const path = `${this.baseUrl}/GetFinalCardProject`
    return this.httpService.put(path, searchModel)
  }

  getDailyRecordListReport(searchModel) {
    const path = `${this.baseUrl}/GetDailyRecordListReport`
    return this.httpService.put(path, searchModel)
  }

  dashboard(searchModel) {
    const path = `${this.baseUrl}/DashboardReport`
    return this.httpService.put(path, searchModel)
  }

  GetBachReportOnDate(searchModel) {
    const path = `${this.baseUrl}/GetBachReportOnDate`
    return this.httpService.put(path, searchModel)
  }

  GetDailyRecordListProductUnitsReport(searchModel) {
    const path = `${this.baseUrl}/GetDailyRecordListProductUnitsReport`
    return this.httpService.put(path, searchModel)
  }

}