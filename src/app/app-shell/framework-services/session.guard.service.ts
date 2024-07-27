import { inject } from '@angular/core';
import { UserService } from '../user-management/services/user.service';
import { environment } from 'src/environment/environment';
import { CodeFlowService } from './code-flow.service';
import { PasswordFlowService } from './password-flow.service';

export const sessionGuard = () => {
    const passwordFlowService = inject(PasswordFlowService);
    const codeFlowService = inject(CodeFlowService);

    const userService = inject(UserService);

    userService.hasActiveSession()
        .subscribe(data => {
            if (data.isActive) {
                return true;
            }

            if (environment.ssoAuthenticationFlow == 'code') {
                codeFlowService.logout()
            } else {
                passwordFlowService.logout()
            }

            return false
        })
}