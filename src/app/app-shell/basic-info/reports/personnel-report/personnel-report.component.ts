import { FormBuilder, FormGroup } from '@angular/forms'
import { Component, OnInit } from '@angular/core';
import { ReportService } from '../report.service';
import { AgGridBaseComponent } from 'src/app/app-shell/framework-components/ag-grid-base/ag-grid-base.component';
import { PersonnelService } from '../../personnel/personnel.service';
import { getCurrentMonth, getCurrentYear, months, weeks, years } from 'src/app/app-shell/framework-components/constants'
import { BreadcrumbService } from 'src/app/app-shell/framework-services/breadcrumb.service';
import { SalonService } from '../../salon/salon.service';
import { NotificationService } from 'src/app/app-shell/framework-services/notification.service';

@Component({
  selector: 'app-personnel-report',
  templateUrl: './personnel-report.component.html'
})
export class PersonnelReportComponent extends AgGridBaseComponent implements OnInit {

  columnDefs
  personnels = []
  weeks = weeks;
  months = months;
  years = years
  records = []
  salons = []

  form: FormGroup

  constructor(private readonly fb: FormBuilder,
    private readonly personnelService: PersonnelService,
    private readonly reportService: ReportService,
    private readonly salonService: SalonService,
    private readonly notificationService: NotificationService,
    private readonly breadCrumbService: BreadcrumbService) {
    super(false)

    const month = getCurrentMonth()
    const year = getCurrentYear()

    this.form = fb.group({
      salonGuid: [],
      personnelGuid: [],
      weekIds: [],
      monthIds: [[month]],
      yearIds: [[year]],
      fromDate: [],
      toDate: []
    })
  }

  override ngOnInit(): void {
    this.breadCrumbService.setTitle('عملکرد پرسنل')
    this.getPersonnels()

    this.columnDefs = [
      {
        field: 'fullname',
        headerName: 'نام و نام خانوادگی',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'nationalCode',
        headerName: 'کدملی',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'projectCode',
        headerName: 'کد پروژه',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'taskMasterName',
        headerName: 'نام کارفرما',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'partName',
        headerName: 'گروه و نوع قطعه',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'standardWireConsumptionPerHours',
        headerName: 'مصرف استاندارد قطعه (Kg/h)',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'totalHoursReported',
        headerName: 'ساعت گزارش شده',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'hoursInProduction',
        headerName: 'ساعت در اختیار تولید',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'wireConsumption',
        headerName: 'مقدار مصرف واقعی (Kg)',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'standardWireConsumption',
        headerName: 'مقدار مصرف استاندارد (Kg)',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'randeman',
        headerName: 'راندمان (%)',
        filter: 'agSetColumnFilter'
      }
    ]
  }

  getPersonnels() {
    this.salonService
      .getForComboBySalonType(2)
      .subscribe((data: any) => this.salons = data)

    this.personnelService
      .getForCombo<[]>()
      .subscribe(data => this.personnels = data)
  }

  getReport() {
    const searchModel = this.form.value

    if (!searchModel.salonGuid) {
      this.notificationService.error('لطفا برای دریافت گزارش سالن را انتخاب نمایید.')
      return
    }

    // if (!searchModel.personnelGuid) {
    //   this.notificationService.error('لطفا برای دریافت گزارش پرسنل را انتخاب نمایید.')
    //   return
    // }

    if (!searchModel.yearIds) {
      this.notificationService.error('لطفا برای دریافت گزارش سال را انتخاب نمایید.')
      return
    }

    this.reportService
      .getPersonnelReport(searchModel)
      .subscribe((data: []) => {
        this.records = data
      })
  }

  modalUpdated() {
    let columnsForAggregation = [
      { column: 'totalHoursReported', type: 'sum' },
      { column: 'hoursInProduction', type: 'sum' },
      { column: 'wireConsumption', type: 'sum' },
      { column: 'standardWireConsumption', type: 'sum' }
    ]

    let pinnedRow = this.generatePinnedBottomData(columnsForAggregation)
    this.gridApi.setPinnedBottomRowData([pinnedRow])
  }
}
