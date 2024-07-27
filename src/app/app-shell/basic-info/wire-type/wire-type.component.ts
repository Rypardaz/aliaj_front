import { AfterViewInit, Component } from '@angular/core';
import { ModalFormBaseComponent } from '../../framework-components/modal/modal-form-base.component'
import { FormBuilder, Validators } from '@angular/forms'
import { WireTypeModel } from './wire-type-model'
import { WireTypeService } from "./wire-type.service"
import { WireTypeGroupService } from '../wire-type-group/wire-type-group.service';
import { ComboBase } from '../../framework-components/combo-base';
import { EditDeleteCellRenderer } from '../../framework-components/ag-grid/edit-delete-cell-btn';

@Component({
  selector: 'app-wire-type',
  templateUrl: './wire-type.component.html'
})
export class WireTypeComponent extends ModalFormBaseComponent<WireTypeService, WireTypeModel> implements AfterViewInit {
  wireTypeGroups: ComboBase[];

  constructor(private readonly fb: FormBuilder,
    wireTypeService: WireTypeService,
    private readonly wireTypeGroupService: WireTypeGroupService) {
    super('نوع سیم', wireTypeService, 'BasicInformation_MissionType')

    this.form = this.fb.group({
      guid: [''],
      wireTypeGroupGuid: ['', [
        Validators.required,
      ]],
      name: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(100)
      ]],
      wireSize: ['', [
        Validators.min(0.1)
      ]]
    })

    this.afterListFetch
      .subscribe(_ => {
        this.wireTypeGroupService
          .getForCombo<ComboBase[]>()
          .subscribe(data => this.wireTypeGroups = data)
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
        field: 'wireTypeGroup',
        headerName: 'گروه سیم',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'name',
        headerName: 'نام سیم',
        filter: 'agSetColumnFilter',
        cellClass: 'ltr'
      },
      {
        field: 'wireSize',
        headerName: 'سایز سیم (mm)',
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
