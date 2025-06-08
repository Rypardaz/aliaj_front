import { AfterViewInit, Component } from '@angular/core';
import { ModalFormBaseComponent } from '../../framework-components/modal/modal-form-base.component'
import { FormBuilder, Validators } from '@angular/forms'
import { SalonModel } from './salon-model'
import { SalonService } from "./salon.service"
import { EditDeleteCellRenderer } from '../../framework-components/ag-grid/edit-delete-cell-btn';
import { ComboBase } from '../../framework-components/combo-base';
import { ListItemService } from '../list-item/list-item.service';

@Component({
  selector: 'app-salon',
  templateUrl: './salon.component.html'
})
export class SalonComponent extends ModalFormBaseComponent<SalonService, SalonModel> implements AfterViewInit {

  types: ComboBase[] = []

  constructor(private readonly fb: FormBuilder,
    salonService: SalonService,
    private readonly listItemService: ListItemService) {
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
      code: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(20)
      ]],
      name: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(100)
      ]],
      typeGuid: ['', [
        Validators.required
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
        field: 'code',
        headerName: 'کد',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'name',
        headerName: 'نام',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'typeName',
        headerName: 'نوع واحد',
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

    this.listItemService
      .getForCombo<ComboBase[]>('14')
      .subscribe(data => this.types = data)
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit()
  }
}