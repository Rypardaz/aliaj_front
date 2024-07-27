import { AfterViewInit, Component } from '@angular/core';
import { ModalFormBaseComponent } from '../../framework-components/modal/modal-form-base.component'
import { FormBuilder, Validators } from '@angular/forms'
import { PowderTypeModel } from './powder-type-model'
import { PowderTypeService } from "./powder-type.service"
import { PowderTypeGroupComponent } from '../powder-type-group/powder-type-group.component';
import { ComboBase } from '../../framework-components/combo-base';
import { PowderTypeGroupService } from '../powder-type-group/powder-type-group.service';
import { EditDeleteCellRenderer } from '../../framework-components/ag-grid/edit-delete-cell-btn';

@Component({
  selector: 'app-powder-type',
  templateUrl: './powder-type.component.html'
})
export class PowderTypeComponent extends ModalFormBaseComponent<PowderTypeService, PowderTypeModel> implements AfterViewInit {
  powderTypeGroups: ComboBase[];

  constructor(private readonly fb: FormBuilder,
    private readonly powderTypeService: PowderTypeService,
    private readonly powderTypeGroupService: PowderTypeGroupService) {
    super('انواع پودر', powderTypeService, 'BasicInformation_MissionType')

    this.form = this.fb.group({
      guid: [''],
      powderTypeGroupGuid: ['', [
        Validators.required,
      ]],
      name: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(100)
      ]],
    })

    this.afterListFetch
      .subscribe(_ => {
        this.powderTypeGroupService
          .getForCombo<ComboBase[]>()
          .subscribe(data => this.powderTypeGroups = data)
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
        field: 'powderTypeGroup',
        headerName: 'گروه پودر',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'name',
        headerName: 'نام پودر',
        filter: 'agSetColumnFilter'
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
