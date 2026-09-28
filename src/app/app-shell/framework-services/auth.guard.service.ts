import { inject } from '@angular/core'
import { UserService } from '../basic-info/user/user.service'

export const authGuard = () => {
    const userService = inject(UserService)

    if (userService.isLoggedIn()) {
        return true
    }

    userService.logout()
    return false
}