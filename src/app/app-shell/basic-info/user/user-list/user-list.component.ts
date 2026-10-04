import { RouterLink } from '@angular/router'
import { Component, OnInit } from '@angular/core'
import { UserService } from '../user.service'
import { ModalFormBaseComponent } from 'src/app/app-shell/framework-components/modal/modal-form-base.component'
import { User } from '../user'
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { operationSuccessful } from 'src/app/app-shell/framework-components/app-messages'
import { CustomInputComponent } from '../../../framework-components/custom-controls/custom-input/custom-input.component';
import { CustomSelectComponent } from '../../../framework-components/custom-controls/custom-select/custom-select.component';
import { ModalComponent } from '../../../framework-components/modal/modal.component';
import { IconButtonComponent } from '../../../framework-components/custom-buttons/icon-button.component';

import { LabelIconButtonComponent } from '../../../framework-components/custom-buttons/label-icon-button.component';
import { Role } from '../../role/role'
import { RoleService } from '../../role/role.service'

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  imports: [LabelIconButtonComponent, RouterLink, IconButtonComponent, ModalComponent, FormsModule, ReactiveFormsModule, CustomSelectComponent, CustomInputComponent]
})
export class UserListComponent extends ModalFormBaseComponent<UserService, User> implements OnInit {

  roles: Role[]

  constructor(readonly userService: UserService,
    private readonly roleService: RoleService) {
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

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit()

    this.afterListFetch
      .subscribe(_ => {
        this.roleService
          .getForCombo<Role[]>()
          .subscribe(data => this.roles = data)
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