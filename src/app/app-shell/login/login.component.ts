import { AsyncPipe } from '@angular/common'
import { Subscription, Observable } from 'rxjs'
import { Component, OnInit, OnDestroy } from '@angular/core'
import { FeatureService } from '../basic-info/feature/feature.service'
import { IdentityService } from 'src/app/app-shell/framework-services/identity.service'
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'
import { NotificationService } from 'src/app/app-shell/framework-services/notification.service'
import { PasswordFlowService } from 'src/app/app-shell/framework-services/password-flow.service'
import { LocalStorageService } from 'src/app/app-shell/framework-services/local.storage.service'
import { PERMISSIONS_NAME, ROLE_TOKEN_NAME, USER_ID_NAME } from 'src/app/app-shell/framework-services/configuration'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [ReactiveFormsModule, AsyncPipe]
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup
  isLoading$: Observable<boolean>
  unsubscribe: Subscription[] = []
  showPassword = false
  captchaText = ''
  captchaError = false

  constructor(
    private fb: FormBuilder,
    private readonly notificationService: NotificationService,
    private readonly identityService: IdentityService,
    private readonly passwordFlowService: PasswordFlowService,
    private readonly localStorageService: LocalStorageService,
    private readonly featureService: FeatureService) { }

  ngOnInit(): void {
    this.initForm()
    this.isLoading$ = this.passwordFlowService.isLoading$

    if (this.passwordFlowService.isLoggedIn()) {
      this.passwordFlowService.navigateToDashboard()
    }

    this.generateCaptcha()
  }

  submit() {
    this.loginForm.markAllAsTouched()
    if (this.loginForm.invalid) {
      return
    }

    const command = this.loginForm.value
    this.captchaError = command.captcha.trim().toUpperCase() !== this.captchaText
    if (this.captchaError) {
      this.generateCaptcha(false)
      return
    }

    const loginSubscr = this.passwordFlowService
      .login(command.username, command.password, 'PhoenixExample')
      .subscribe({
        next: () => {
          this.notificationService.succeded('ورود با موفقیت انجام شد، لطفا کمی صبر کنید...')
          this.getIdAndRole()
        },
        error: () => {
          this.generateCaptcha()
        }
      })

    this.unsubscribe.push(loginSubscr)
  }

  getIdAndRole() {
    this.identityService
      .getIdAndRole()
      .subscribe({
        next: result => {
          this.localStorageService.setItem(USER_ID_NAME, result.id)
          this.localStorageService.setItem(ROLE_TOKEN_NAME, result.role)
        },
        error: () => this.passwordFlowService.logout(),
        complete: () => this.getFeatures()
      })
  }

  getFeatures() {
    this.featureService
      .getUserPermissions()
      .subscribe({
        next: permissions => {
          this.localStorageService.setItem(PERMISSIONS_NAME, permissions)
          this.passwordFlowService.navigateToDashboard(true)
        },
        error: () => this.passwordFlowService.logout(),
      })
  }

  get f() {
    return this.loginForm.controls
  }

  initForm() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(320)]],
      password: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      captcha: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
    })
  }

  generateCaptcha(clearError = true) {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    this.captchaText = Array.from({ length: 5 }, () =>
      characters.charAt(Math.floor(Math.random() * characters.length))
    ).join('')
    this.loginForm.controls['captcha'].reset('')
    if (clearError) {
      this.captchaError = false
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe())
  }
}
