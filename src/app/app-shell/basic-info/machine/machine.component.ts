import { AfterViewInit, Component } from '@angular/core';
import { ModalFormBaseComponent } from '../../framework-components/modal/modal-form-base.component'
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MachineModel } from './machine-model'
import { MachineService } from "./machine.service"
import { ComboBase } from '../../framework-components/combo-base';
import { SalonService } from '../salon/salon.service';
import { EditDeleteCellRenderer } from '../../framework-components/ag-grid/edit-delete-cell-btn';
import { NgSelectModule } from '@ng-select/ng-select';
import { CustomInputComponent } from '../../framework-components/custom-controls/custom-input/custom-input.component';
import { ModalComponent } from '../../framework-components/modal/modal.component';
import { AgGridModule } from 'ag-grid-angular';
import { LabelIconButtonComponent } from '../../framework-components/custom-buttons/label-icon-button.component';

@Component({
  selector: 'app-machine',
  templateUrl: './machine.component.html',
  imports: [LabelIconButtonComponent, AgGridModule, ModalComponent, FormsModule, ReactiveFormsModule, CustomInputComponent, NgSelectModule]
})
export class MachineComponent extends ModalFormBaseComponent<MachineService, MachineModel> implements AfterViewInit {

  salons: ComboBase[];
  heads = [
    { guid: 1, title: 1 },
    { guid: 2, title: 2 }
  ]
  constructor(private readonly fb: FormBuilder,
    private readonly machineService: MachineService,
    private readonly salonService: SalonService) {
    super('ماشین آلات', machineService, 'BasicInformation_MissionType')

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
      headCount: ['', [
        Validators.required
      ]],
      ip: null,
      salonGuid: null,
      description: null,
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
        headerName: 'کد ماشین',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'name',
        headerName: 'نام ماشین',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'salon',
        headerName: 'واحد فعال',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'headCount',
        headerName: 'تعداد هد',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'description',
        headerName: 'توضیحات',
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

  openMachineSetting() {
    const ip = this.getFormValue(this.form, 'ip')
    if (!ip) {
      this.notificationService.error('آیپی دستگاه مشخص نشده است.')
      return
    }

    window.open(ip, "_blank")
  }
}
