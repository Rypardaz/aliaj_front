import { AfterViewInit, Component } from '@angular/core';
import { ModalFormBaseComponent } from '../../framework-components/modal/modal-form-base.component'
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { PartGroupModel } from './part-group-model'
import { PartGroupService } from "./part-group.service"
import { EditDeleteCellRenderer } from '../../framework-components/ag-grid/edit-delete-cell-btn';
import { SalonService } from '../salon/salon.service';
import { CustomInputComponent } from '../../framework-components/custom-controls/custom-input/custom-input.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ModalComponent } from '../../framework-components/modal/modal.component';
import { AgGridModule } from 'ag-grid-angular';
import { LabelIconButtonComponent } from '../../framework-components/custom-buttons/label-icon-button.component';

@Component({
  selector: 'app-part-group',
  templateUrl: './part-group.component.html',
  imports: [LabelIconButtonComponent, AgGridModule, ModalComponent, FormsModule, ReactiveFormsModule, NgSelectModule, CustomInputComponent]
})
export class PartGroupComponent extends ModalFormBaseComponent<PartGroupService, PartGroupModel> implements AfterViewInit {

  salons = []

  constructor(private readonly fb: FormBuilder,
    partGroupService: PartGroupService,
    private readonly salonService: SalonService) {
    super('گروه قطعه', partGroupService, 'BasicInformation_MissionType')

    this.form = this.fb.group({
      guid: [''],
      name: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(100)
      ]],
      salonGuid: ['', [Validators.required]]
    })

    this.afterListFetch
      .subscribe(_ => {
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
        field: 'salonName',
        headerName: 'نام سالن',
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

    this.salonService
      .getForCombo()
      .subscribe((data: any) => this.salons = data)
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit()
  }
}