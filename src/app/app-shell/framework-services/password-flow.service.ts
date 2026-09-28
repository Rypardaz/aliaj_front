import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { HttpClient } from '@angular/common/http'
import { ACCESS_TOKEN_NAME, DATABASAE_NAME, PERMISSIONS_NAME, ROLE_TOKEN_NAME, SETTINGS_NAME, USER_ID_NAME } from './configuration'
import { LocalStorageService } from './local.storage.service'
import { BehaviorSubject, Observable } from 'rxjs'
import { BreadcrumbService } from './breadcrumb.service'
import { UserService } from '../basic-info/user/user.service'

@Injectable()
export class PasswordFlowService {

    isLoading$: Observable<boolean>
    private isLoadingSubject: BehaviorSubject<boolean>

    constructor(private router: Router,
        private localStorageService: LocalStorageService,
        private readonly userService: UserService,
        private readonly breadcrumbService: BreadcrumbService) {
        this.isLoadingSubject = new BehaviorSubject<boolean>(false)
        this.isLoading$ = this.isLoadingSubject.asObservable()
    }

    navigateToDashboard() {
        this.router.navigateByUrl('/dashboard')
    }

    logout() {
        const token = this.localStorageService.getItem(ACCESS_TOKEN_NAME)
        const userGuid = this.localStorageService.getItem(USER_ID_NAME)

        if (token && token != 'undefined') {
            this.userService
                .closeSessions(userGuid)
                .subscribe(_ => {
                    this.localStorageService.removeItem(ACCESS_TOKEN_NAME)
                    this.localStorageService.removeItem(ROLE_TOKEN_NAME)
                    this.localStorageService.removeItem(USER_ID_NAME)
                    this.localStorageService.removeItem(PERMISSIONS_NAME)
                    this.localStorageService.removeItem(SETTINGS_NAME)
                    this.localStorageService.removeItem(DATABASAE_NAME)
                    this.breadcrumbService.reset()
                    this.router.navigateByUrl('/login')
                })
        } else {
            this.router.navigateByUrl('/login')
        }
    }

    isLoggedIn() {
        return this.localStorageService.exists(ACCESS_TOKEN_NAME)
    }

    getToken() {
        return this.localStorageService.getItem(ACCESS_TOKEN_NAME)
    }
}