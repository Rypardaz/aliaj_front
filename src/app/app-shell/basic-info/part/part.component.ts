import { AfterViewInit, Component } from '@angular/core';
import { ModalFormBaseComponent } from '../../framework-components/modal/modal-form-base.component'
import { FormBuilder, Validators } from '@angular/forms'
import { PartModel } from './part-model'
import { PartGroupService } from "../part-group/part-group.service"
import { PartService } from "./part.service"
import { ComboBase } from '../../framework-components/combo-base';
import { EditDeleteCellRenderer } from '../../framework-components/ag-grid/edit-delete-cell-btn';

@Component({
  selector: 'app-part',
  templateUrl: './part.component.html'
})
export class PartComponent extends ModalFormBaseComponent<PartService, PartModel> implements AfterViewInit {

  partGroups: ComboBase[];

  constructor(private readonly fb: FormBuilder,
    private readonly partGroupService: PartGroupService,
    private readonly partService: PartService) {
    super('نوع قطعه', partService, 'BasicInformation_MissionType')

    this.form = this.fb.group({
      guid: [''],
      partGroupGuid: ['', [
        Validators.required,
      ]],
      name: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(100)
      ]],
      standardWireConsumption: null
    })

    this.afterListFetch
      .subscribe(_ => {
        this.partGroupService
          .getForCombo<ComboBase[]>()
          .subscribe(data => this.partGroups = data)
      })
  }

  override ngOnInit(): void {
    super.ngOnInit();
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
        field: 'partGroupName',
        headerName: 'گروه قطعه',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'name',
        headerName: 'نام قطعه',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'standardWireConsumption',
        headerName: 'استاندارد مصرف (KG/h)',
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
