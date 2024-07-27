import { AfterViewInit, Component } from '@angular/core';
import { ModalFormBaseComponent } from '../../framework-components/modal/modal-form-base.component'
import { FormBuilder, Validators } from '@angular/forms'
import { SalonModel } from './salon-model'
import { SalonService } from "./salon.service"
import { EditDeleteCellRenderer } from '../../framework-components/ag-grid/edit-delete-cell-btn';

@Component({
  selector: 'app-salon',
  templateUrl: './salon.component.html'
})
export class SalonComponent extends ModalFormBaseComponent<SalonService, SalonModel> implements AfterViewInit {

  constructor(private readonly fb: FormBuilder,
    salonService: SalonService) {
    super('واحدهای تولید', salonService, 'BasicInformation_MissionType')

    this.initForm()

    this.afterListFetch
      .subscribe(_ => {
        // this.datatableService.init()
      })

    this.afterReset
      .subscribe(reset => {
        this.setFormValue(this.form, "hasGas", true)
        this.setFormValue(this.form, "hasWire", true)
        this.setFormValue(this.form, "hasWireScrew", true)
        this.setFormValue(this.form, "hasPowder", true)
      })
  }

  override initForm() {
    this.form = this.fb.group({
      guid: [''],
      name: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(100)
      ]],
      hasGas: [true],
      hasWire: [true],
      hasWireScrew: [true],
      hasPowder: [true],
    })
  }

  override ngOnInit(): void {
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
        field: 'hasGas',
        headerName: 'استفاده از گاز',
        filter: 'agSetColumnFilter',
        cellClass: params => {
          return params.value == 'فعال' ? 'text-success' : 'text-danger';
        },
      },
      {
        field: 'hasWire',
        headerName: 'استفاده از سیم',
        filter: 'agSetColumnFilter',
        cellClass: params => {
          return params.value == 'فعال' ? 'text-success' : 'text-danger';
        },
      },
      {
        field: 'hasWireScrew',
        headerName: 'استفاده از بچ سیم',
        filter: 'agSetColumnFilter',
        cellClass: params => {
          return params.value == 'فعال' ? 'text-success' : 'text-danger';
        },
      },
      {
        field: 'hasPowder',
        headerName: 'استفاده از پودر',
        filter: 'agSetColumnFilter',
        cellClass: params => {
          return params.value == 'فعال' ? 'text-success' : 'text-danger';
        },
      },
      {
        field: 'isActiveStr',
        headerName: 'وضعیت',
        filter: 'agSetColumnFilter',
        cellClass: params => {
          return params.value == 'فعال' ? 'text-success' : 'text-danger';
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
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit()
  }
}