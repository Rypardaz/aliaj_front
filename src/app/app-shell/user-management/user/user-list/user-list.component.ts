import { Router } from '@angular/router'
import { Component, OnInit } from '@angular/core'
import { UserService } from '../../services/user.service'
import { LocalStorageService } from 'src/app/app-shell/framework-services/local.storage.service'
import { SettingService } from 'src/app/app-shell/framework-services/setting.service'
import { BreadcrumbService } from 'src/app/app-shell/framework-services/breadcrumb.service'
import { ModalFormBaseComponent } from 'src/app/app-shell/framework-components/modal/modal-form-base.component'
import { User } from '../../types/user'
import { NotificationService } from 'src/app/app-shell/framework-services/notification.service'
import { UserGroupService } from '../../services/user-group.service'
import { UserGroup } from '../../types/user-group'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { operationSuccessful } from 'src/app/app-shell/framework-components/app-messages'

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html'
})
export class UserListComponent extends ModalFormBaseComponent<UserService, User> implements OnInit {

  userGroups: UserGroup[]

  constructor(readonly userService: UserService,
    private readonly userGroupService: UserGroupService) {
    super('مدیریت کاربران', userService)

    this.form = new FormGroup({
      guid: new FormControl(),
      userGroupId: new FormControl(),
      username: new FormControl('', Validators.required),
      fullname: new FormControl('', Validators.required),
      password: new FormControl(),
      rePassword: new FormControl(),
      mobile: new FormControl('', Validators.required),
    })
  }

  override ngOnInit(): void {
    super.ngOnInit()

    this.afterListFetch
      .subscribe(_ => {
        this.userGroupService
          .getForCombo<UserGroup[]>()
          .subscribe(data => this.userGroups = data)
      })
  }

  navigateToEdit(id) {
    this.router.navigate(['user-management/user/edit', id])
  }

  closeSession(guid) {
    this.userService
      .closeSessions(guid)
      .subscribe(_ => {
        this.notificationService.succeded(operationSuccessful)
      })
  }
}