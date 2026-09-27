import { AfterViewInit, Component } from '@angular/core';
import { ModalFormBaseComponent } from '../../framework-components/modal/modal-form-base.component'
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { GasTypeModel } from './gas-type-model'
import { GasTypeService } from "./gas-type.service"
import { ComboBase } from '../../framework-components/combo-base';
import { GasTypeGroupService } from '../gas-type-group/gas-type-group.service';
import { EditDeleteCellRenderer } from '../../framework-components/ag-grid/edit-delete-cell-btn';
import { CustomInputComponent } from '../../framework-components/custom-controls/custom-input/custom-input.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ModalComponent } from '../../framework-components/modal/modal.component';
import { AgGridModule } from 'ag-grid-angular';
import { LabelIconButtonComponent } from '../../framework-components/custom-buttons/label-icon-button.component';

@Component({
    selector: 'app-gas-type',
    templateUrl: './gas-type.component.html',
    imports: [LabelIconButtonComponent, AgGridModule, ModalComponent, FormsModule, ReactiveFormsModule, NgSelectModule, CustomInputComponent]
})
export class GasTypeComponent extends ModalFormBaseComponent<GasTypeService, GasTypeModel> implements AfterViewInit {

  gasTypeGroups: ComboBase[];

  constructor(private readonly fb: FormBuilder,
    private readonly gasTypeService: GasTypeService,
    private readonly gasTypeGroupService: GasTypeGroupService
  ) {
    super('نوع گاز', gasTypeService, 'BasicInformation_MissionType')

    this.form = this.fb.group({
      guid: [''],
      gasTypeGroupGuid: ['', [
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
        this.gasTypeGroupService
          .getForCombo<ComboBase[]>()
          .subscribe(data => this.gasTypeGroups = data)
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
        field: 'gasTypeGroup',
        headerName: 'گروه گاز',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'name',
        headerName: 'نام گاز',
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
