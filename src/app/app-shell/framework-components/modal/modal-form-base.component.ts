import { AfterViewInit, Component, EventEmitter, Inject, OnDestroy, OnInit, Output, QueryList, ViewChild, ViewChildren, inject, signal } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { NotificationService } from '../../framework-services/notification.service'
import { ServiceBase } from '../../framework-services/service.base'
import { AgGridBaseComponent } from '../ag-grid-base/ag-grid-base.component'
import { ModalComponent } from './modal.component'
import { ModalConfig } from './modal.config'
import { BreadcrumbService } from '../../framework-services/breadcrumb.service'
import { formGroupToFormData } from '../constants'
import { Router } from '@angular/router'
import { DatatableService } from '../../framework-services/datatable.service'
import { FeatureService } from '../../basic-info/feature/feature.service'
import { firstValueFrom, Observable } from 'rxjs'
declare var $: any

@Component({
  standalone: true,
  selector: 'app-modal-form-base',
  template: ''
})
export class ModalFormBaseComponent<T extends ServiceBase, TModel> extends AgGridBaseComponent implements OnInit, AfterViewInit, OnDestroy {

  isModalOpen = false
  title: string
  form: FormGroup
  records: TModel[] = []
  modalConfig = new ModalConfig()
  featureTitle = ''
  loading$ = signal(false)

  @Output() afterListFetch = new EventEmitter()
  @Output() afterModalOpened = new EventEmitter()
  @Output() afterEntityFetch = new EventEmitter<any>()
  @Output() afterFormSubmit = new EventEmitter<number>()
  @Output() afterDelete = new EventEmitter()
  @Output() afterReset = new EventEmitter()

  @ViewChild('opsModal') private opsModalComponent: ModalComponent
  @ViewChildren('tableTr') things: QueryList<any>

  featureService = inject(FeatureService)
  router = inject(Router)
  datatableService = inject(DatatableService)
  notificationService = inject(NotificationService)
  breadcrumbService = inject(BreadcrumbService)

  constructor(
    @Inject(String) title,
    @Inject(ServiceBase) readonly service: T,
    @Inject(String) featureTitle = '') {
    super()
    this.title = title
    this.featureTitle = featureTitle
    this.breadcrumbService.setTitle(title)
  }

  override async ngOnInit(): Promise<void> {
    super.ngOnInit()
    await this.getList()
  }

  ngAfterViewInit(): void { }

  listSubscription = this.service.getList<TModel[]>()

  async getList() {
    this.records = []

    const data = await this.executeWithLoading(this.listSubscription)
    this.handleListSubscription(data)
  }

  handleListSubscription(data) {
    this.records = data
    this.afterListFetch.emit()
  }

  async delete(id) {
    const t = await this.fireDeleteSwal()
    if (t.value === true) {
      await this.deleteRecord(id)
    } else {
      this.dismissDeleteSwal(t)
    }
  }

  async deleteRecord(id) {
    await this.executeWithLoading(this.service.delete(id))
    await this.getList()

    this.fireDeleteSucceddedSwal()
    this.afterDelete.emit()
  }

  async openOpsModal(guid = null) {
    if (guid) {
      const data = await this.executeWithLoading(this.service.getForEdit(guid))

      this.modalConfig.modalTitle = `ویرایش ${this.title}`
      this.form.patchValue(data)
      this.afterEntityFetch.emit(data)
      this.afterModalOpened.emit()
    }
    else {
      this.form.reset()
      this.afterReset.emit()
      this.modalConfig.modalTitle = `ایجاد ${this.title}`
      this.afterModalOpened.emit()
    }

    this.opsModalComponent.open()
  }

  async activate(guid: string) {
    await this.executeWithLoading(this.service.activate(guid))
    await this.getList()
  }

  async deactivate(guid: string) {
    await this.executeWithLoading(this.service.deactivate(guid))
    await this.getList()
  }

  async submit(action, hasFile = false) {
    if (this.form.invalid) {
      this.notificationService.error('اطلاعات فرم به درستی وارد نشده است.')
      return
    }

    if (hasFile) {
      await this.submitWithFile(action)
    } else {
      await this.submitWithJson(action)
    }
  }

  async submitWithJson(action) {
    const command = this.form.value

    const request$ = command.guid
      ? this.service.edit(command)
      : this.service.create(command)

    const result = await this.executeWithLoading(request$)
    if (result === undefined) return

    this.handleCreateEditOps(action)
  }

  async submitWithFile(action) {
    const guid = this.form.value.guid
    const formData = formGroupToFormData(this.form)

    const request$ = guid
      ? this.service.editWithFile(formData)
      : this.service.createWithFile(formData)

    const result = await this.executeWithLoading(request$)
    if (result === undefined) return

    this.handleCreateEditOps(action)
  }

  async handleCreateEditOps(action) {
    if (action == "new") {
      this.form.reset()
      this.modalConfig.modalTitle = `ایجاد ${this.title}`
    }
    else if (action == "exit") {
      this.opsModalComponent.close()
    }

    // this.initForm()
    this.afterReset.emit()
    this.afterFormSubmit.emit()
    await this.getList()

    this.notificationService.succeded()
  }

  ngOnDestroy(): void {
    this.afterListFetch.unsubscribe()
    this.afterFormSubmit.unsubscribe()
    this.afterDelete.unsubscribe()
    this.afterReset.unsubscribe()
  }

  modalClosed() {
    this.form.enable()
    this.form.reset()
    $('#submitForm').removeClass('was-validated')
    $('.radioItem').removeAttr('active')
  }

  forceCloseModal() {
    setTimeout(() => { this.opsModalComponent.close() }, 2000)

    this.notificationService.succeded()
  }

  initForm() {
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
    this.loading$.set(true)
    try {
      return await firstValueFrom(observable$)
    } catch (error) {
      console.error(error)
      return undefined
    } finally {
      this.loading$.set(false)
    }
  }
}