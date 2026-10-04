import { AfterViewInit, Component } from '@angular/core';
import { ModalFormBaseComponent } from '../../framework-components/modal/modal-form-base.component'
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { WireTypeGroupModel } from './wire-type-group-model'
import { WireTypeGroupService } from "./wire-type-group.service"
import { EditDeleteCellRenderer } from '../../framework-components/ag-grid/edit-delete-cell-btn';
import { CustomInputComponent } from '../../framework-components/custom-controls/custom-input/custom-input.component';
import { ModalComponent } from '../../framework-components/modal/modal.component';
import { AgGridModule } from 'ag-grid-angular';
import { LabelIconButtonComponent } from '../../framework-components/custom-buttons/label-icon-button.component';

@Component({
  selector: 'app-wire-type-group',
  templateUrl: './wire-type-group.component.html',
  imports: [LabelIconButtonComponent, AgGridModule, ModalComponent, FormsModule, ReactiveFormsModule, CustomInputComponent]
})
export class WireTypeGroupComponent extends ModalFormBaseComponent<WireTypeGroupService, WireTypeGroupModel> implements AfterViewInit {

  constructor(private readonly fb: FormBuilder,
    wireTypeGroupService: WireTypeGroupService) {
    super('گروه های سیم', wireTypeGroupService, 'BasicInformation_MissionType')

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

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit()

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
