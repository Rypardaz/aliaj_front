import { Component, OnInit, inject } from '@angular/core';
import { LocalStorageService } from '../../framework-services/local.storage.service';
import { SettingService } from '../../framework-services/setting.service';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from '../../framework-services/breadcrumb.service';
import { NotificationService } from '../../framework-services/notification.service';
declare var $: any;

@Component({
  selector: 'app-app-shared-data',
  templateUrl: './app-shared-data.component.html',
  standalone: true
})
export class AppSharedDataComponent implements OnInit {
  loading$ = new BehaviorSubject(false)

  SomeGlobalSetting;

  readonly router = inject(Router)
  readonly activatedRoute = inject(ActivatedRoute)
  readonly settingService = inject(SettingService)
  readonly breadcrumbService = inject(BreadcrumbService)
  readonly notificationService = inject(NotificationService)
  readonly localStorageService = inject(LocalStorageService)

  constructor() {
  }

  async ngOnInit() { }

  getFormValue(form: FormGroup, controlName: string) {
    return form.get(controlName).value;
  }

  setFormValue(form: FormGroup, controlName: string, value: any) {
    form.get(controlName).setValue(value);
  }

  disableFormControl(form: FormGroup, controlName: string) {
    form.get(controlName).disable();
  }

  enableFormControl(form: FormGroup, controlName: string) {
    form.get(controlName).enable();
  }

  hideElement(id) {
    $(id).addClass('d-none');
  }

  showElement(id) {
    $(id).removeClass('d-none');
  }

  async execute<T>(observable$: Observable<T>): Promise<T | undefined> {
    try {
      return await firstValueFrom(observable$)
    } catch (error) {
      console.error(error)
      return undefined
    }
  }

  async executeWithLoading<T>(observable$: Observable<T>): Promise<T | undefined> {
    this.loading$.next(true)
    try {
      return await firstValueFrom(observable$)
    } catch (error) {
      console.error(error)
      return undefined
    } finally {
      this.loading$.next(false)
    }
  }

}