import { Injectable } from '@angular/core';
import { UserManager, UserManagerSettings, User } from 'oidc-client';
import { LocalStorageService } from './local.storage.service';
import { UserService } from '../user-management/services/user.service';
import { BreadcrumbService } from './breadcrumb.service';
import { environment } from 'src/environment/environment';
import { ACCESS_TOKEN_NAME, USER_ID_NAME, ROLE_TOKEN_NAME, PERMISSIONS_NAME, SETTINGS_NAME, DATABASAE_NAME, USER_COMPANY_ID_NAME, USER_ORGANIZATION_CHART_ID_NAME } from './configuration';

@Injectable({
    providedIn: 'root'
})
export class CodeFlowService {

    private manager = new UserManager(getClientSettings());
    public user: User = null;

    constructor(
        private readonly userService: UserService,
        private readonly breadcrumbService: BreadcrumbService,
        private readonly localStorageService: LocalStorageService) {
        this.manager.getUser().then(user => {
            this.user = user;
        });
    }

    isLoggedIn(): boolean {
        return this.localStorageService.exists(ACCESS_TOKEN_NAME)
    }

    getClaims(): any {
        return this.user.profile;
    }

    getAuthorizationHeaderValue(): string {
        return `${this.user.token_type} ${this.user.access_token}`;
    }

    startAuthentication(): Promise<void> {
        return this.manager.signinRedirect({ isCheckAuthority: true });
    }

    completeAuthentication(): Promise<void> {
        return this.manager.signinRedirectCallback().then(user => {
            this.user = user;
        });
    }

    logout() {
        if (this.isLoggedIn()) {
            const userGuid = this.localStorageService.getItem(USER_ID_NAME)
            this.userService
                .closeSessions(userGuid)
                .subscribe(_ => {
                    this.localStorageService.removeItem(ACCESS_TOKEN_NAME)
                    this.localStorageService.removeItem(ROLE_TOKEN_NAME)
                    this.localStorageService.removeItem(USER_ID_NAME)
                    this.localStorageService.removeItem(PERMISSIONS_NAME)
                    this.localStorageService.removeItem(SETTINGS_NAME)
                    this.localStorageService.removeItem(DATABASAE_NAME)
                    this.localStorageService.removeItem(USER_COMPANY_ID_NAME)
                    this.localStorageService.removeItem(USER_ORGANIZATION_CHART_ID_NAME)

                    this.breadcrumbService.reset()

                    this.manager.signoutRedirect()
                })
        } else {
            this.startAuthentication()
        }
    }

    getToken() {
        return this.localStorageService.getItem(ACCESS_TOKEN_NAME)
    }
}

export function getClientSettings(): UserManagerSettings {
    return {
        authority: environment.identityEndpoint,
        client_id: 'PhoenixClientCode',
        client_secret: '4568_!*&^^%',
        redirect_uri: environment.selfEndpoint + `/#/challange`,
        post_logout_redirect_uri: environment.identityEndpoint,
        response_type: "code",
        scope: "openid profile PhoenixCoreApi UserManagementApi",
        filterProtocolClaims: true,
        loadUserInfo: true
    };
}