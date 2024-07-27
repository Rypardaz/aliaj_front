import { Injectable } from "@angular/core";
import { ServiceBase } from "../../framework-services/service.base";
import { HttpService } from "../../framework-services/http.service";

@Injectable({
  providedIn: 'root'
})
export class WorkCalendarService extends ServiceBase {

  constructor(httpService: HttpService) {
    super("WorkCalendar", httpService)
  }

  getWorkCalendars(searchModel) {
    const path = `${this.baseUrl}/GetList`
    return this.httpService.getWithParams<any>(path, searchModel)
  }
}
