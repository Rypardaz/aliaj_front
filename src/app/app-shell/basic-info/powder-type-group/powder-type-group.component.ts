import { AfterViewInit, Component } from '@angular/core';
import { ModalFormBaseComponent } from '../../framework-components/modal/modal-form-base.component'
import { FormBuilder, Validators } from '@angular/forms'
import { PowderTypeGroupModel } from './powder-type-group-model'
import { PowderTypeGroupService } from "./powder-type-group.service"
import { EditDeleteCellRenderer } from '../../framework-components/ag-grid/edit-delete-cell-btn';

@Component({
  selector: 'app-powder-type-group',
  templateUrl: './powder-type-group.component.html'
})
export class PowderTypeGroupComponent extends ModalFormBaseComponent<PowderTypeGroupService, PowderTypeGroupModel> implements AfterViewInit {

  constructor(private readonly fb: FormBuilder,
    powderTypeGroupService: PowderTypeGroupService) {
    super('گروه های پودر', powderTypeGroupService, 'BasicInformation_MissionType')

    this.form = this.fb.group({
      guid: [''],
      name: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(100)
      ]],
    })

    this.afterListFetch
      .subscribe(_ => {
        // this.datatableService.init()
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
        headerName: 'نام گروه',
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
