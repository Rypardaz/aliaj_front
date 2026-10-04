import { AfterViewInit, Component, inject } from '@angular/core'
import { ModalFormBaseComponent } from '../../framework-components/modal/modal-form-base.component'
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MaterialModel } from './material-model'
import { MaterialService } from "./material.service"
import { ComboBase } from '../../framework-components/combo-base'
import { EditDeleteCellRenderer } from '../../framework-components/ag-grid/edit-delete-cell-btn'
import { CustomInputComponent } from '../../framework-components/custom-controls/custom-input/custom-input.component'
import { ModalComponent } from '../../framework-components/modal/modal.component'
import { AgGridModule } from 'ag-grid-angular'
import { LabelIconButtonComponent } from '../../framework-components/custom-buttons/label-icon-button.component'
import { UnitService } from '../unit/unit.service'
import { CustomNgSelectComponent } from '../../framework-components/custom-controls/custom-ng-select/custom-ng-select.component'

@Component({
  selector: 'app-material-type',
  templateUrl: './material.component.html',
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
export class MaterialComponent extends ModalFormBaseComponent<MaterialService, MaterialModel> implements AfterViewInit {

  units: ComboBase[]

  private readonly fb = inject(FormBuilder)
  private readonly unitService = inject(UnitService)

  constructor(materialService: MaterialService) {
    super('متریان مصرفی', materialService, '')

    this.form = this.fb.group({
      guid: [''],
      name: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(100)
      ]],
      code: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(100)
      ]],
      unitGuid: null,
    })
  }

  override async ngOnInit(): Promise<void> {
    super.ngOnInit()

    this.gridOptions.columnDefs = [
      {
        field: 'ویرایش/حذف/وضعیت',
        pinned: "left",
        cellRenderer: EditDeleteCellRenderer,
        cellRendererParams: {
          editPermission: "",
          deletePermission: "",
          editInModal: true,
          hasActiveMode: true,
          hasEditMode: true,
          hasDeleteMode: true
        },
        width: 200
      },
      {
        field: 'name',
        headerName: 'نام متریال مصرفی',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'code',
        headerName: 'کد متریال مصرفی',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'unitName',
        headerName: 'واحد سنجش',
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

    await this.getUnits()
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit()
  }

  async getUnits() {
    this.units = await this.execute(this.unitService.getForCombo<ComboBase[]>())
  }
}
