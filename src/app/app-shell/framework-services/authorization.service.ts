import { Injectable } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { LocalStorageService } from './local.storage.service';
import { PERMISSIONS_NAME } from './configuration';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  constructor(private papa: Papa,
    private readonly localStorageService: LocalStorageService) { }

  checkPermission(neededPermission: string) {
    const userPermissions = this.getPermissions()

    let hasPermission = false
    if (!userPermissions) return hasPermission
    if (!neededPermission[0]) return true

    this.papa.parse(userPermissions, {
      complete: (result) => {
        if (result.data.length == 0) {
          hasPermission = false
        }

        if (result.data[0].find(x => x == neededPermission)) {
          hasPermission = true
        }
      }
    })
    return hasPermission
  }

  hasNoAnyPermissions(): boolean {
    const userPermissions = this.getPermissions()
    return userPermissions === ""
  }

  getPermissions() {
    return this.localStorageService.getItem(PERMISSIONS_NAME)
  }
}
