import { Injectable } from "@angular/core";
import { ServiceBase } from "../../framework-services/service.base";
import { HttpService } from "../../framework-services/http.service";

@Injectable({
  providedIn: 'root'
})
export class TicketService extends ServiceBase {

  constructor(httpService: HttpService) {
    super("Ticket", httpService)
  }

  getTickets(searchModel) {
    const path = `${this.baseUrl}/GetList`
    return this.httpService.getWithParams<any>(path, searchModel)
  }
}
