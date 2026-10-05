import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ModalFormBaseComponent } from '../../framework-components/modal/modal-form-base.component'
import { FormBuilder, Validators } from '@angular/forms'
import { ComboBase } from '../../framework-components/combo-base';
import { SalonService } from '../salon/salon.service';
import { DailyRecordModel } from './daily-record-model';
import { DailyRecordService } from './daily-record.service';
import { SALON_GUID_NAME } from '../../framework-services/configuration';
import { EditDeleteCellRenderer } from '../../framework-components/ag-grid/edit-delete-cell-btn';
import { AgGridToolsComponent } from '../../framework-components/ag-grid-tools/ag-grid-tools.component';
import { AgGridModule } from 'ag-grid-angular';
import { GridSearchPanelComponent } from '../../framework-components/grid-search-panel/grid-search-panel.component';
import { LabelIconButtonComponent } from '../../framework-components/custom-buttons/label-icon-button.component';

@Component({
  selector: 'app-daily-record',
  templateUrl: './daily-record.component.html',
  imports: [LabelIconButtonComponent, GridSearchPanelComponent, AgGridToolsComponent, AgGridModule]
})
export class DailyRecordComponent extends ModalFormBaseComponent<DailyRecordService, DailyRecordModel> implements AfterViewInit {
  salonGuid
  salons: ComboBase[];
  searchModel: any

  @ViewChild(AgGridToolsComponent) agGridTools: AgGridToolsComponent

  constructor(private readonly fb: FormBuilder,
    dailyRecordService: DailyRecordService,
    private readonly salonService: SalonService) {
    super('لیست گزارشات روزانه', dailyRecordService, 'BasicInformation_MissionType')

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
      taskMasterGuid: null,
      dailyrecordTypeGuid: null,
      salonGuid: null,
      deliveryDate: null,
      description: null
    })

    this.afterListFetch
      .subscribe(_ => {
        this.salonService
          .getForCombo<ComboBase[]>()
          .subscribe(data => {
            this.salons = data
            this.agGridTools.restoreState()
          })
      })
  }

  override async ngOnInit(): Promise<void> {
    this.salonGuid = this.localStorageService.getItem(SALON_GUID_NAME)

    this.salonService
      .getForCombo<ComboBase[]>()
      .subscribe(data => {
        this.salons = data
        this.breadcrumbService.reset()
        const title = `لیست اطلاعات روزانه - ${this.salons.find(x => x.guid == this.salonGuid).title}`
        this.breadcrumbService.setTitle(title)

      })

    this.gridOptions.columnDefs = [
      {
        field: 'عملیات',
        pinned: "left",
        cellRenderer: EditDeleteCellRenderer,
        cellRendererParams: {
          editPermission: "BasicInformation_MissionType",
          deletePermission: "BasicInformation_MissionType",
          hasActiveMode: false,
          hasEditMode: true,
          hasDeleteMode: true,
          editUrl: '/basic-info/daily-record-ops'
        },
        width: 70
      },
      {
        field: 'date',
        headerName: 'تاریخ',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'shiftName',
        headerName: 'شیفت کاری',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'machineName',
        headerName: 'نام دستگاه',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'head',
        headerName: 'شماره هد',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'totalHours',
        headerName: 'مجموع ساعات',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'totalActivityHours',
        headerName: 'خالص ساعت جوشکاری'
      },
      {
        field: 'totalStopHours',
        headerName: 'خالص ساعت توقف'
      },
      {
        field: 'totalWireConsumption',
        headerName: 'سیم مصرفی',
        filter: 'agSetColumnFilter'
      },
      // {
      //   field: 'description',
      //   headerName: 'توضیحات',
      //   filter: 'agSetColumnFilter'
      // },
      // {
      //   field: 'created',
      //   headerName: 'تاریخ ایجاد',
      //   filter: 'agSetColumnFilter'
      // }
    ]
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit()
  }

  override async getList() {
    this.records = []
    this.searchModel.salonGuid = this.salonGuid

    const data = await this.executeWithLoading(this.service.getDailyRecords(this.searchModel))
    this.handleListSubscription(data)
  }

  navigateTo(guid = null) {
    let path = 'basic-info/daily-record-ops'
    if (guid) {
      path += `/${guid}`
    }

    this.router.navigateByUrl(path)
  }


  async searchList(searchModel) {
    this.searchModel = searchModel
    await this.getList()
  }
}