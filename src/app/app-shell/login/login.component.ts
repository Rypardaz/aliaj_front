import { AsyncPipe } from '@angular/common'
import { UserService } from '../basic-info/user/user.service'
import { Subscription, Observable, firstValueFrom } from 'rxjs'
import { Component, OnInit, OnDestroy, inject } from '@angular/core'
import { FeatureService } from '../basic-info/feature/feature.service'
import { ACCESS_TOKEN_NAME, PERMISSIONS_NAME } from 'src/app/app-shell/framework-services/configuration'
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'
import { PasswordFlowService } from 'src/app/app-shell/framework-services/password-flow.service'
import { LocalStorageService } from 'src/app/app-shell/framework-services/local.storage.service'

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

  private fb = inject(FormBuilder)
  private readonly passwordFlowService = inject(PasswordFlowService)
  private readonly localStorageService = inject(LocalStorageService)
  private readonly featureService = inject(FeatureService)
  private readonly userService = inject(UserService)

  constructor() { }

  ngOnInit(): void {
    this.initForm()
    this.isLoading$ = this.passwordFlowService.isLoading$

    if (this.passwordFlowService.isLoggedIn()) {
      this.passwordFlowService.navigateToDashboard()
    }

    this.generateCaptcha()
  }

  async submit() {
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

    const reuslt = await firstValueFrom<any>(this.userService.login(command))
    if (reuslt === undefined) {
      this.generateCaptcha()
    }

    this.localStorageService.setItem(ACCESS_TOKEN_NAME, reuslt.token)
    // this.localStorageService.setItem(DATABASAE_NAME, dbName)

    // const identity = await firstValueFrom(this.identityService.getIdAndRole())
    // this.localStorageService.setItem(USER_ID_NAME, identity.id)
    // this.localStorageService.setItem(ROLE_TOKEN_NAME, identity.role)

    const permissions = await firstValueFrom(this.featureService.getUserPermissions())
    this.localStorageService.setItem(PERMISSIONS_NAME, permissions)
    this.passwordFlowService.navigateToDashboard()
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
