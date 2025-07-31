import { Component, OnInit } from '@angular/core';
import { ReportService } from '../report.service';
import { FormBuilder, FormGroup } from '@angular/forms'
import { SalonService } from '../../salon/salon.service';
import { BreadcrumbService } from 'src/app/app-shell/framework-services/breadcrumb.service';
import { AgGridBaseComponent } from 'src/app/app-shell/framework-components/ag-grid-base/ag-grid-base.component';
import { getCurrentMonth, getCurrentYear, months, weeks, years } from 'src/app/app-shell/framework-components/constants';
import { NotificationService } from 'src/app/app-shell/framework-services/notification.service';

@Component({
  selector: 'app-dailyrecordlistproductunits',
  templateUrl: './dailyrecordlistproductunits.component.html'
})
export class DailyrecordlistproductunitsComponent extends AgGridBaseComponent implements OnInit {

  columnDefs
  salons = []
  records = []
  columns = []
  years = years
  weeks = weeks
  months = months
  form: FormGroup

  constructor(readonly fb: FormBuilder,
    private readonly salonService: SalonService,
    private readonly reportService: ReportService,
    private readonly notificationService: NotificationService,
    private readonly breadCrumbService: BreadcrumbService) {
    super(false)

    const month = getCurrentMonth()
    const year = getCurrentYear()

    this.form = fb.group({
      salonGuid: [],
      yearIds: [[year]],
      weekIds: [],
      monthIds: [[month]],
      fromDate: [],
      toDate: [],
      type: [4]
    })
  }

  override ngOnInit(): void {
    this.breadCrumbService.setTitle('اطلاعات فرم روزانه تولید')
    this.getSalons()
  }

  getSalons() {
    this.salonService
      .getForComboBySalonType(1)
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

    this.columnDefs = [
      {
        field: 'date',
        headerName: 'تاریخ فرم',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'shiftName',
        headerName: 'شیفت',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'month',
        headerName: 'ماه',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'week',
        headerName: 'هفته',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'salonName',
        headerName: 'واحد کاری',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'machineName',
        headerName: 'کد ماشین',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'personnelName',
        headerName: 'نام',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'personnelFamily',
        headerName: 'نام خانوادگی',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'personnelCode',
        headerName: 'کدپرسنلی',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'activityTypeName',
        headerName: 'نوع فعالیت/توقف',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'activityTypeCode',
        headerName: 'کد نوع فعالیت/توقف',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'activityName',
        headerName: 'نام فعالیت/توقف',
        filter: 'agSetColumnFilter'
      },


      {
        field: 'activitySubType',
        headerName: 'کد زیرگروه',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'activityCode',
        headerName: 'کد فعالیت/توقف',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'startTime',
        headerName: 'ساعت شروع',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'endTime',
        headerName: 'ساعت پایان',
        filter: 'agSetColumnFilter'
      },


      {
        field: 'totalTime',
        headerName: 'کل زمان ثبت شده',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'wireTypeProduced',
        headerName: 'نوع سیم تولید/بسته بندی',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'wireSizeProduced',
        headerName: 'سایز سیم تولید/بسته بندی',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'producedWire',
        headerName: 'مقدار تولید / بسته بندی سیم',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'producedScrew',
        headerName: 'بچ تولید/بسته بندی سیم',
        filter: 'agSetColumnFilter'
      },
    ]

    this.reportService
      .GetDailyRecordListProductUnitsReport(searchModel)
      .subscribe((data: []) => {
        this.records = data
      })
  }
}