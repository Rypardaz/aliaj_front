import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { ComboBase } from 'src/app/app-shell/framework-components/combo-base'
import { UserService } from '../../services/user.service'
import { NotificationService } from 'src/app/app-shell/framework-services/notification.service'
import { LocalStorageService } from 'src/app/app-shell/framework-services/local.storage.service'
import { FeatureService } from '../../services/feature.service'
import { BreadcrumbService } from 'src/app/app-shell/framework-services/breadcrumb.service'
import { USER_CLASSIFICATION_LEVEL_ID_NAME, USER_ORGANIZATION_CHART_ID_NAME, } from 'src/app/app-shell/framework-services/configuration'
import { UserModel } from './userModel'
import * as moment from 'jalali-moment'
import { classificationLevelError } from 'src/app/app-shell/framework-components/app-messages'
import { Router } from '@angular/router'
import { AgGridBaseComponent } from 'src/app/app-shell/framework-components/ag-grid-base/ag-grid-base.component'
import { SettingService } from 'src/app/app-shell/framework-services/setting.service'
import { UserSessionSuccessCellRendererComponent } from './user-session-success-cell-renderer.component'

@Component({
  selector: 'app-user-log',
  templateUrl: './user-log.component.html'
})
export class UserLogComponent extends AgGridBaseComponent implements OnInit {
  userList: ComboBase[] = []
  userLogList: UserModel[] = []
  form: FormGroup
  title: string

  constructor(
    private readonly fb: FormBuilder,
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly notificationService: NotificationService,
    private readonly featureService: FeatureService,
    private readonly breadcrumbService: BreadcrumbService) {
    super()

    this.form = this.fb.group({
      guid: [''],
      userGuid: [''],
      startDatePer: [this.getToday()],
      endDatePer: [this.getToday()],
      clientIpAddress: [''],
    })
  }

  override ngOnInit() {
    super.ngOnInit()
    this.getLog()
    this.getClassificationLevel()
    this.initForm()

    this.gridOptions.columnDefs = [
      {
        field: 'username',
        headerName: 'نام کاربری',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'fullname',
        headerName: 'نام کاربر',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'nationalCode',
        headerName: 'کدملی',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'companyTitle',
        headerName: 'شرکت',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'organizationChartTitle',
        headerName: 'واحد سازمانی',
        filter: 'agSetColumnFilter'
      },
      {
        headerName: 'وضعیت',
        filter: 'agSetColumnFilter',
        cellRenderer: UserSessionSuccessCellRendererComponent
      },
      {
        field: 'clientIpAddress',
        headerName: 'IP Address',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'created',
        headerName: 'تاریخ ورود',
        filter: 'agSetColumnFilter'
      },
    ]
  }

  initForm() {
    this.form.patchValue({
      guid: '',
      userGuid: '',
      startDatePer: this.getToday(),
      endDatePer: this.getToday(),
      clientIpAddress: '',
    })
  }

  getToday() {
    let today: any = new Date()
    const dd = String(today.getDate()).padStart(2, '0')
    const mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
    const yyyy = today.getFullYear()
    today = mm + '/' + dd + '/' + yyyy
    return moment(today).locale('fa').format('YYYY/MM/DD')
  }

  getUsers() {
    this.userService
      .getForCombo(
        this.localStorageService.getItem(USER_ORGANIZATION_CHART_ID_NAME)
      )
      .subscribe({
        next: (data: ComboBase[]) => {
          this.userList = data
        },
      })
  }

  getClassificationLevel() {
    const userClassificationLevelGuid = this.localStorageService.getItem(
      USER_CLASSIFICATION_LEVEL_ID_NAME
    )
    const searchModel = {
      featureTitle: 'SystemManagement_User',
      userClassificationLevelGuid,
    }

    this.featureService
      .getClassificationLevelByTitle(searchModel)
      .subscribe((result) => {
        if (!result) {
          this.notificationService.error(classificationLevelError)
          this.router.navigateByUrl('/dashboard')
          return
        }
        this.getUsers()
        this.title = 'گزارش ورود کاربران'
        this.breadcrumbService.setTitle(this.title)
        this.breadcrumbService.setClassificationLevel(result.title)
      })
  }

  getLog() {
    this.userService
      .getUserSessionsLog(this.form.value)
      .subscribe((data: UserModel[]) => {
        this.userLogList = data
      })
  }
}
