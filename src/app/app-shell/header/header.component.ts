import { Component, OnInit, AfterViewInit, ViewChild, AfterContentInit } from '@angular/core';
import { PasswordFlowService } from '../framework-services/password-flow.service';
import { UserService } from '../user-management/services/user.service';
import { LocalStorageService } from '../framework-services/local.storage.service';
import { USER_CLASSIFICATION_LEVEL_ID_NAME, USER_COMPANY_ID_NAME, USER_ORGANIZATION_CHART_ID_NAME } from '../framework-services/configuration';
import { ModalComponent } from '../framework-components/modal/modal.component';
import { FormBuilder } from '@angular/forms';
import { NotificationService } from '../framework-services/notification.service';
import { operationSuccessful } from '../framework-components/app-messages';
import { ModalConfig } from '../framework-components/modal/modal.config';
import { CodeFlowService } from '../framework-services/code-flow.service';
import { environment } from 'src/environment/environment';
import { getTodayDate } from '../framework-components/constants';
declare var $: any

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ["./header.style.css"]
})
export class HeaderComponent implements OnInit, AfterContentInit {

  information = {
    fullname: '',
    companyTitle: '',
    organizationChartTitle: '',
    classificationLevel: '',
    needChangePassword: false,
    companyGuid: '',
    organizationChartGuid: ''
  }

  passwordStrength = 0
  changePassModalConfig = new ModalConfig()
  mobileMenuState = 1
  day
  todayDate

  @ViewChild('changePasswordModal') private changePasswordModal: ModalComponent

  form = this.fb.group({
    password: [''],
    rePassword: ['']
  })

  constructor(private readonly fb: FormBuilder,
    private readonly passwordFlowService: PasswordFlowService,
    private readonly codeFlowService: CodeFlowService,
    private readonly userService: UserService,
    private readonly localStorageService: LocalStorageService,
    private readonly notificationService: NotificationService) {
  }

  ngAfterContentInit(): void {
    this.userInformation()
  }

  ngOnInit(): void {
    const d = new Date();
    let day = d.getDay();
    const weekday = ["یکشنبه", "دوشنبه", "سه شنبه", "چهارشنبه", "پنج شنبه", "جمعه", "شنبه"];

    this.day = weekday[day]

    this.todayDate = getTodayDate()

    this.changePassModalConfig.id = 'changePasswordModal'
    this.changePassModalConfig.hideHeader = false
  }

  get password() {
    return this.form.get('password').value
  }

  userInformation() {
    this.userService
      .getUserInformation()
      .subscribe({
        next: result => {
          this.information = result
          this.localStorageService.setItem(USER_COMPANY_ID_NAME, result.companyGuid)
          this.localStorageService.setItem(USER_ORGANIZATION_CHART_ID_NAME, result.organizationChartGuid)
          this.localStorageService.setItem(USER_CLASSIFICATION_LEVEL_ID_NAME, result.classificationLevelGuid)

          // if (this.information.needChangePassword) {
          //   this.changePassModalConfig.modalTitle = 'هشدار امنیتی، لطفا کلمه رمز را تغییر دهید'
          //   this.changePassModalConfig.hideCloseButton = true
          //   this.changePassModalConfig.submitButtonLabel = 'اعمال تغییر'
          //   this.changePasswordModal.open()
          // }
        },
        complete: () => { }
      })
  }

  strengthChange(strength) {
    this.passwordStrength = strength
  }

  openChangePasswordModal() {
    this.changePassModalConfig.modalTitle = 'تغییر کلمه رمز'
    this.changePassModalConfig.dualSave = false
    this.changePasswordModal.open()
  }

  changePassword(action) {
    const command = this.form.value

    if (command.password && this.passwordStrength < 4) {
      this.notificationService.error('کلمه عبور ضعیف است. کلمه عبور باید شامل حروف، اعداد و کاراکتر باشد و حداقل طول آن 6 کاراکتر است.')
      return
    }

    if (command.password != command.rePassword) {
      this.notificationService.error('کلمه رمز با تکرار آن برابر نیست.')
      return
    }

    this.userService
      .changePassword(command)
      .subscribe(data => {
        this.changePasswordModal.close()
        this.notificationService.succeded(operationSuccessful)
      })
  }

  logout() {
    if (environment.ssoAuthenticationFlow == 'code') {
      this.codeFlowService.logout()
    } else {
      this.passwordFlowService.logout()
    }
  }

  mobileMenuButton() {
    var ua = navigator.userAgent

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua)) {
      $("body").attr("data-sidebar-size", "default")
      if (this.mobileMenuState == 1) {
        $("body").addClass("sidebar-enable")
        this.mobileMenuState = 0
      } else {
        $("body").removeClass("sidebar-enable")
        this.mobileMenuState = 1
      }
    }
    else if (/Chrome/i.test(ua)) {
      this.desktopFunction()
    }
    else {
      this.desktopFunction()
    }
  }

  desktopFunction() {
    if (this.mobileMenuState == 1) {
      $("body").attr("data-sidebar-size", "condensed")
      this.mobileMenuState = 0
    } else {
      $("body").attr("data-sidebar-size", "default")
      this.mobileMenuState = 1
    }
  }
}