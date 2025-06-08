import { Injectable } from "@angular/core";
import { ServiceBase } from "../../framework-services/service.base";
import { HttpService } from "../../framework-services/http.service";

@Injectable({
  providedIn: 'root'
})
export class ChartService extends ServiceBase {

  constructor(httpService: HttpService) {
    super("Chart", httpService)
  }

  getWireConsumptionChart(salonGuid) {
    const path = `${this.baseUrl}/GetWireConsumptionChart`
    return this.httpService.put(path, salonGuid)
  }

  getRandemanChart(salonGuid) {
    const path = `${this.baseUrl}/GetRandemanChart`
    return this.httpService.put(path, salonGuid)
  }

  getWireConsumptionToStandardChart(salonGuid) {
    const path = `${this.baseUrl}/GetWireConsumptionToStandardChart`
    return this.httpService.put(path, salonGuid)
  }

  getActivityChart(salonGuid) {
    const path = `${this.baseUrl}/GetActivityChart`
    return this.httpService.put(path, salonGuid)
  }

  getProjectChart(salonGuid) {
    const path = `${this.baseUrl}/GetProjectChart`
    return this.httpService.put(path, salonGuid)
  }
}