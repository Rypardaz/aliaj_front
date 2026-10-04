import { AfterViewInit, Component } from '@angular/core';
import { ModalFormBaseComponent } from '../../framework-components/modal/modal-form-base.component'
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { PersonnelModel } from './personnel-model'
import { PersonnelService } from "./personnel.service"
import { ComboBase } from '../../framework-components/combo-base';
import { SalonService } from '../salon/salon.service';
import { EditDeleteCellRenderer } from '../../framework-components/ag-grid/edit-delete-cell-btn';
import { NgSelectModule } from '@ng-select/ng-select';
import { CustomInputComponent } from '../../framework-components/custom-controls/custom-input/custom-input.component';
import { ModalComponent } from '../../framework-components/modal/modal.component';
import { AgGridModule } from 'ag-grid-angular';
import { LabelIconButtonComponent } from '../../framework-components/custom-buttons/label-icon-button.component';

@Component({
  selector: 'app-personnel',
  templateUrl: './personnel.component.html',
  imports: [LabelIconButtonComponent, AgGridModule, ModalComponent, FormsModule, ReactiveFormsModule, CustomInputComponent, NgSelectModule]
})
export class PersonnelComponent extends ModalFormBaseComponent<PersonnelService, PersonnelModel> implements AfterViewInit {

  salons: ComboBase[];

  constructor(private readonly fb: FormBuilder,
    private readonly personnelService: PersonnelService,
    private readonly salonService: SalonService) {
    super('پرسنل', personnelService, 'BasicInformation_MissionType')

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
      family: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(100)
      ]],
      nationalCode: [''],
      salonGuid: null,
    })

    this.afterListFetch
      .subscribe(_ => {
        this.salonService
          .getForCombo<ComboBase[]>()
          .subscribe(data => this.salons = data)
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
        field: 'code',
        headerName: 'کد پرسنلی',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'name',
        headerName: 'نام',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'family',
        headerName: 'نام خانوادگی',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'nationalCode',
        headerName: 'کدملی',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'salonName',
        headerName: 'واحد',
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
