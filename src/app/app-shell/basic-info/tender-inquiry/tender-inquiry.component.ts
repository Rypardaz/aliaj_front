import { AgGridModule } from 'ag-grid-angular'
import { TenderInquiryModel } from './tender-inquiry-model'
import { TenderInquiryService } from './tender-inquiry.service'
import { ComboBase } from '../../framework-components/combo-base'
import { AfterViewInit, Component, ViewChild } from '@angular/core'
import { EditDeleteCellRenderer } from '../../framework-components/ag-grid/edit-delete-cell-btn'
import { ModalFormBaseComponent } from '../../framework-components/modal/modal-form-base.component'
import { AgGridToolsComponent } from '../../framework-components/ag-grid-tools/ag-grid-tools.component'
import { LabelIconButtonComponent } from '../../framework-components/custom-buttons/label-icon-button.component'
import { GridSearchPanelComponent } from '../../framework-components/grid-search-panel/grid-search-panel.component'

@Component({
  selector: 'app-tender-inquiry',
  templateUrl: './tender-inquiry.component.html',
  imports: [LabelIconButtonComponent, GridSearchPanelComponent, AgGridToolsComponent, AgGridModule]
})
export class TenderInquiryComponent extends ModalFormBaseComponent<TenderInquiryService, TenderInquiryModel> implements AfterViewInit {
  salonGuid
  salons: ComboBase[]
  searchModel: any

  @ViewChild(AgGridToolsComponent) agGridTools: AgGridToolsComponent

  constructor(tenderInquiryService: TenderInquiryService) {
    super('کارتابل استعلام/مناقصه', tenderInquiryService, '')
  }

  override async ngOnInit(): Promise<void> {
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