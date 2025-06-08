import { Injectable } from "@angular/core";
import { ServiceBase } from "../../framework-services/service.base";
import { HttpService } from "../../framework-services/http.service";

@Injectable({
  providedIn: 'root'
})
export class SalonService extends ServiceBase {

  constructor(httpService: HttpService) {
    super("Salon", httpService)
  }

  getForComboBySalonType(salonType) {
    const path = `${this.baseUrl}/GetForCombo`
    return this.httpService.get<any>(path, salonType)
  }
}
