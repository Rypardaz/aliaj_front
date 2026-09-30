import { AgGridModule } from 'ag-grid-angular'
import { TaskMasterService } from "./task-master.service"
import { RegionService } from '../region/region.service'
import { AfterViewInit, Component, inject } from '@angular/core'
import { TaskMasterContact, TaskMasterModel } from './task-master-model'
import { ModalComponent } from '../../framework-components/modal/modal.component'
import { EditDeleteCellRenderer } from '../../framework-components/ag-grid/edit-delete-cell-btn'
import { ModalFormBaseComponent } from '../../framework-components/modal/modal-form-base.component'
import { FormArray, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { LabelIconButtonComponent } from '../../framework-components/custom-buttons/label-icon-button.component'
import { CustomInputComponent } from '../../framework-components/custom-controls/custom-input/custom-input.component'
import { CustomNgSelectComponent } from '../../framework-components/custom-controls/custom-ng-select/custom-ng-select.component'
import { firstValueFrom } from 'rxjs'
import { ListItemService } from '../list-item/list-item.service'

@Component({
  selector: 'app-task-master',
  templateUrl: './task-master.component.html',
  imports: [
    LabelIconButtonComponent,
    AgGridModule,
    ModalComponent,
    FormsModule,
    ReactiveFormsModule,
    CustomInputComponent,
    CustomNgSelectComponent
  ]
})
export class TaskMasterComponent extends ModalFormBaseComponent<TaskMasterService, TaskMasterModel> implements AfterViewInit {

  factoryProvinces = []
  factoryCities = []

  officeProvinces = []
  officeCities = []

  industryTypes = []

  fb = inject(FormBuilder)
  regionService = inject(RegionService)
  listItemService = inject(ListItemService)

  constructor(taskMasterService: TaskMasterService) {
    super('کارفرمایان', taskMasterService, 'BasicInformation_MissionType')

    this.modalConfig.size = 'modal-full-width'

    this.form = this.fb.group({
      guid: [''],
      name: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(100)
      ]],
      industryTypeId: ['', Validators.required],
      registrationNumber: [''],
      nationalId: [''],
      economicNumber: [''],
      officeProvinceGuid: [''],
      officeCityGuid: [''],
      officePostalCode: [''],
      officeAddress: [''],
      officePhone: [''],
      factoryProvinceGuid: [''],
      factoryCityGuid: [''],
      factoryPostalCode: [''],
      factoryAddress: [''],
      factoryPhone: [''],
      contacts: this.fb.array([this.createContact()]),
    })

    this.afterReset
      .subscribe(() => this.resetContacts())

    this.afterEntityFetch
      .subscribe((data: TaskMasterModel) => {
        this.contacts.clear()
        for (const contact of data.contacts ?? []) {
          this.contacts.push(this.createContact(contact))
        }
        if (!this.contacts.length) this.addContact()
      })

    this.form
      .get('officeProvinceGuid')
      .valueChanges
      .subscribe(officeProvinceGuid => {
        this.getCities(officeProvinceGuid, 'office')
      })

    this.form
      .get('factoryProvinceGuid')
      .valueChanges
      .subscribe(factoryProvinceGuid => {
        this.getCities(factoryProvinceGuid, 'factory')
      })
  }

  get contacts(): FormArray {
    return this.form.get('contacts') as FormArray
  }

  private createContact(contact?: TaskMasterContact) {
    return this.fb.group({
      name: [contact?.name ?? ''],
      role: [contact?.role ?? ''],
      mobile: [contact?.mobile ?? ''],
      phone: [contact?.phone ?? ''],
    })
  }

  addContact(): void {
    this.contacts.push(this.createContact())
  }

  removeContact(index: number): void {
    this.contacts.removeAt(index)
    if (!this.contacts.length) this.addContact()
  }

  private resetContacts(): void {
    this.contacts.clear()
    this.addContact()
  }

  override modalClosed(): void {
    super.modalClosed()
    this.resetContacts()
  }

  override submit(action, hasFile = false): void {
    this.form.markAllAsTouched()
    super.submit(action, hasFile)
  }

  override async ngOnInit(): Promise<void> {
    super.ngOnInit()
    this.gridOptions.columnDefs = [
      {
        field: 'ویرایش/حذف/وضعیت',
        pinned: "left",
        cellRenderer: EditDeleteCellRenderer,
        cellRendererParams: {
          editPermission: "BasicInformation_MissionType",
          deletePermission: "BasicInformation_MissionType",
          editInModal: true,
          hasActiveMode: true,
          hasEditMode: true,
          hasDeleteMode: true
        },
        width: 200
      },
      {
        field: 'name',
        headerName: 'نام',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'isActiveStr',
        headerName: 'وضعیت',
        filter: 'agSetColumnFilter',
        cellClass: params => {
          return params.value == 'فعال' ? 'text-success' : 'text-danger'
        },
      },
      {
        field: 'createdBy',
        headerName: 'ایجاد کننده',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'created',
        headerName: 'تاریخ ایجاد',
        filter: 'agSetColumnFilter'
      }
    ]

    await this.getProvinces('office')
    await this.getProvinces('factory')

    this.industryTypes = await firstValueFrom(this.listItemService.getForCombo('15'))
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit()
  }

  async getProvinces(destination: string) {
    const searchModel = {}
    const provinces = await firstValueFrom(this.regionService.getListWithParams(searchModel))

    if (destination == 'office') {
      this.officeProvinces = provinces
    } else {
      this.factoryProvinces = provinces
    }
  }

  async getCities(provinceGuid, destination) {
    if (!provinceGuid) return

    const searchModel = {
      provinceGuid
    }

    const cities = await firstValueFrom(this.regionService.getListWithParams(searchModel))
    if (destination == 'office') {
      this.officeCities = cities
    } else {
      this.factoryCities = cities
    }
  }
}
