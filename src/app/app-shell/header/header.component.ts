import { Component, OnInit, ViewChild, AfterContentInit } from '@angular/core';
import { PasswordFlowService } from '../framework-services/password-flow.service';
import { LocalStorageService } from '../framework-services/local.storage.service';
import { ModalComponent } from '../framework-components/modal/modal.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificationService } from '../framework-services/notification.service';
import { operationSuccessful } from '../framework-components/app-messages';
import { ModalConfig } from '../framework-components/modal/modal.config';
import { getTodayDate } from '../framework-components/constants';
import { UserService } from '../basic-info/user/user.service';
import { PasswordStrengthMeterComponent } from '../framework-components/password-strength-meter/password-strength-meter.component';
import { CustomInputComponent } from '../framework-components/custom-controls/custom-input/custom-input.component';

declare var $: any

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ["./header.style.css"],
  imports: [FormsModule, ModalComponent, ReactiveFormsModule, CustomInputComponent, PasswordStrengthMeterComponent]
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
  day
  todayDate

  @ViewChild('changePasswordModal') private changePasswordModal: ModalComponent

  form = this.fb.group({
    password: [''],
    rePassword: ['']
  })

  constructor(private readonly fb: FormBuilder,
    private readonly passwordFlowService: PasswordFlowService,
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
    this.userService.logout()
  }

  mobileMenuButton() {
    if (window.matchMedia('(max-width: 991.98px)').matches) {
      $("body").attr("data-sidebar-size", "default").toggleClass("sidebar-enable")
      if (document.body.classList.contains('sidebar-enable')) {
        document.querySelector<HTMLButtonElement>('app-sidebar .sidebar-close')?.focus()
      }
    } else {
      this.desktopFunction()
    }
  }

  isMenuExpanded(): boolean {
    return window.matchMedia('(max-width: 991.98px)').matches
      ? document.body.classList.contains('sidebar-enable')
      : document.body.getAttribute('data-sidebar-size') !== 'condensed'
  }

  desktopFunction() {
    const collapsed = $("body").attr("data-sidebar-size") === "condensed"
    $("body").attr("data-sidebar-size", collapsed ? "default" : "condensed")
  }
}
