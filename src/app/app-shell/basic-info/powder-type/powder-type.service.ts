import { Injectable } from "@angular/core";
import { ServiceBase } from "../../framework-services/service.base";
import { HttpService } from "../../framework-services/http.service";

@Injectable({
  providedIn: 'root'
})
export class PowderTypeService  extends ServiceBase{

  constructor(httpService: HttpService) {
    super("PowderType", httpService)
  }
}
