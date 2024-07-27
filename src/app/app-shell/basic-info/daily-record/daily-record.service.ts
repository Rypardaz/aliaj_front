import { Injectable } from "@angular/core";
import { ServiceBase } from "../../framework-services/service.base";
import { HttpService } from "../../framework-services/http.service";

@Injectable({
  providedIn: 'root'
})
export class DailyRecordService extends ServiceBase {

  constructor(httpService: HttpService) {
    super("DailyRecord", httpService)
  }

  getDailyRecords(searchModel) {
    const path = `${this.baseUrl}/GetList`
    return this.httpService.getWithParams<any>(path, searchModel)
  }
}