import { FormBuilder, FormGroup } from '@angular/forms'
import { Component, OnInit } from '@angular/core';
import { ReportService } from '../report.service';
import { AgGridBaseComponent } from 'src/app/app-shell/framework-components/ag-grid-base/ag-grid-base.component';
import { SalonService } from '../../salon/salon.service';
import { BreadcrumbService } from 'src/app/app-shell/framework-services/breadcrumb.service';
import { getCurrentMonth, getCurrentYear, months, weeks, years } from 'src/app/app-shell/framework-components/constants';
import { NotificationService } from 'src/app/app-shell/framework-services/notification.service';
import * as moment from 'jalali-moment';

@Component({
  selector: 'app-by-part-report',
  templateUrl: './by-part-report.component.html'
})
export class ByPartReportComponent extends AgGridBaseComponent implements OnInit {

  columnDefs
  salons = []
  records = []

  years = years
  weeks = weeks;
  months = months;

  form: FormGroup

  constructor(private readonly fb: FormBuilder,
    private readonly salonService: SalonService,
    private readonly reportService: ReportService,
    private readonly notificationService: NotificationService,
    private readonly breadCrumbService: BreadcrumbService) {
    super(false)

    const year = getCurrentYear()
    const month = getCurrentMonth()

    this.form = fb.group({
      salonGuid: [],
      yearIds: [[year]],
      weekIds: [[]],
      monthIds: [[month]],
      fromDate: [],
      toDate: []
    })
  }

  override ngOnInit(): void {
    this.breadCrumbService.setTitle('عملکرد قطعات')
    this.getSalons()

    this.columnDefs = [
      {
        field: 'partGroup',
        headerName: 'گروه قطعه',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'part',
        headerName: 'نوع قطعه',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'reportTime',
        headerName: 'ساعت گزارش شده تولید',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'nonProductionStop',
        headerName: 'ساعت توقفات غیرتولیدی',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'timeInProduction',
        headerName: 'خالص گان ساعت در اختیار تولید',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'timeInProductionPercent',
        headerName: 'درصد ساعت در اختیار',
        filter: 'agSetColumnFilter',
        valueFormatter: p => p.value + ' % '
      },
      {
        field: 'wireConsumption',
        headerName: 'میزان مصرف سیم جوش (کیلوگرم)',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'wireConsumptionPercent',
        headerName: 'درصد از مصرف کل (%)',
        cellRenderer: (data) => {
          return data.value + ' %'
        },
        filter: 'agSetColumnFilter'
      },
      {
        field: 'avgConsumption',
        headerName: 'میانگین مصرف (KG/h)',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'standardWireConsumption',
        headerName: 'استاندارد مصرف قطعه (Kg/h)',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'standardProduction',
        headerName: 'تولید استاندارد',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'randeman',
        headerName: 'راندمان (%)',
        filter: 'agSetColumnFilter',
        valueFormatter: p => p.value + ' % '
      }
    ]
  }

  getSalons() {
    this.salonService
      .getForComboBySalonType(2)
      .subscribe(data => this.salons = data)
  }

  getReport() {
    const searchModel = this.form.value

    if (!searchModel.salonGuid) {
      this.notificationService.error('لطفا برای دریافت گزارش سالن را انتخاب نمایید.')
      return
    }

    if (!searchModel.yearIds) {
      this.notificationService.error('لطفا برای دریافت گزارش سال را انتخاب نمایید.')
      return
    }

    if (!searchModel.weekId)
      searchModel.weekId = ''

    if (!searchModel.monthId)
      searchModel.monthId = ''

    if (!searchModel.fromDate)
      searchModel.fromDate = ''

    if (!searchModel.toDate)
      searchModel.toDate = ''

    this.reportService
      .getByPartReport(searchModel)
      .subscribe(data => {
        this.records = data
      })
  }
}
