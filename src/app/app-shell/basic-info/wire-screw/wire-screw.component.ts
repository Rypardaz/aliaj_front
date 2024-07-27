import { AfterViewInit, Component } from '@angular/core';
import { ModalFormBaseComponent } from '../../framework-components/modal/modal-form-base.component'
import { FormBuilder, Validators } from '@angular/forms'
import { WireScrewModel } from './wire-screw-model'
import { WireScrewService } from "./wire-screw.service"
import { WireTypeService } from '../wire-type/wire-type.service';
import { ComboBase } from '../../framework-components/combo-base';
import { EditDeleteCellRenderer } from '../../framework-components/ag-grid/edit-delete-cell-btn';

@Component({
  selector: 'app-wire-screw',
  templateUrl: './wire-screw.component.html'
})
export class WireScrewComponent extends ModalFormBaseComponent<WireScrewService, WireScrewModel> implements AfterViewInit {
  wireTypes: ComboBase[];

  constructor(private readonly fb: FormBuilder,
    private readonly wireScrewService: WireScrewService,
    private readonly wireTypeService: WireTypeService) {
    super('بچ سیم', wireScrewService, 'BasicInformation_MissionType')

    this.form = this.fb.group({
      guid: [''],
      wireTypeGuid: ['', [
        Validators.required,
      ]],
      screw: ['', [
        Validators.required,
      ]],
      qty: ['', [
        Validators.required,
        Validators.min(0.1)
      ]],
    })

    this.afterListFetch
      .subscribe(_ => {
        this.wireTypeService
          .getForCombo<ComboBase[]>()
          .subscribe(data => this.wireTypes = data)
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
        field: 'wireType',
        headerName: 'نوع سیم',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'wireSize',
        headerName: 'سایز سیم (mm)',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'screw',
        headerName: 'شماره بچ',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'qty',
        headerName: 'مقدار (kg)',
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
