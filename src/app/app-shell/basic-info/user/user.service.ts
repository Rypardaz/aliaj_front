import { inject, Injectable } from '@angular/core'
import { HttpService } from '../../framework-services/http.service'
import { ServiceBase } from '../../framework-services/service.base'
import { getServiceUrl } from 'src/environment/environment'
import { ACCESS_TOKEN_NAME, ROLE_TOKEN_NAME, USER_ID_NAME, PERMISSIONS_NAME, SETTINGS_NAME, DATABASAE_NAME } from '../../framework-services/configuration'
import { LocalStorageService } from '../../framework-services/local.storage.service'
import { Router } from '@angular/router'

@Injectable({
  providedIn: 'root'
})
export class UserService extends ServiceBase {

  router = inject(Router)
  localStorageService = inject(LocalStorageService)

  constructor(httpService: HttpService) {
    super("User", httpService)
  }

  login(command) {
    const path = `${this.baseUrl}/Login`
    return this.httpService.post(path, command)
  }

  changePassword(command) {
    const path = `${this.baseUrl}/ChangePassword`
    return this.httpService.post(path, command)
  }

  changeCompanyId(companyGuid) {
    const path = `${this.baseUrl}/ChangeCompanyId/${companyGuid}`
    return this.httpService.put(path)
  }

  healthCheck() {
    const path = `${getServiceUrl()}health`
    return this.httpService.getWithParams(path, {}, false)
  }

  getUserInformation() {
    const path = `${this.baseUrl}/GetUserInformation`
    return this.httpService.get<any>(path)
  }

  getCurrentUserLastSessions() {
    const path = `${this.baseUrl}/getCurrentUserLastSessions`
    return this.httpService.get<any>(path)
  }

  hasActiveSession() {
    const path = `${this.baseUrl}/hasActiveSession`
    return this.httpService.get<any>(path)
  }

  closeSessions(userGuid) {
    const path = `${this.baseUrl}/closeSessions/${userGuid}`
    return this.httpService.post<any>(path)
  }

  getUserSessionsLog<T>(body: any) {
    const path = `${this.baseUrl}/GetUserSessionsLog`
    return this.httpService.post<T>(path, body)
  }

  isLoggedIn() {
    return this.localStorageService.exists(ACCESS_TOKEN_NAME)
  }

  getToken() {
    return this.localStorageService.getItem(ACCESS_TOKEN_NAME)
  }

  logout() {
    this.localStorageService.removeItem(ACCESS_TOKEN_NAME)
    this.localStorageService.removeItem(ROLE_TOKEN_NAME)
    this.localStorageService.removeItem(USER_ID_NAME)
    this.localStorageService.removeItem(PERMISSIONS_NAME)
    this.localStorageService.removeItem(SETTINGS_NAME)
    this.localStorageService.removeItem(DATABASAE_NAME)

    this.router.navigateByUrl('/login')
  }
}
