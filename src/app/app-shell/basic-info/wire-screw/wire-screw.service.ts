import { Injectable } from "@angular/core";
import { ServiceBase } from "../../framework-services/service.base";
import { HttpService } from "../../framework-services/http.service";

@Injectable({
  providedIn: 'root'
})
export class WireScrewService extends ServiceBase {

  constructor(httpService: HttpService) {
    super("WireScrew", httpService)
  }

  getProductionWireScrews(searchModel) {
    const path = `${this.baseUrl}/GetProductionWireScrews`
    return this.httpService.put(path, searchModel)
  }
}
