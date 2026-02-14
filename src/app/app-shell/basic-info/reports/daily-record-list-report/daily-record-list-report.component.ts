import { Component, OnInit, ViewChild } from '@angular/core';
import { ReportService } from '../report.service';
import { FormBuilder, FormGroup } from '@angular/forms'
import { SalonService } from '../../salon/salon.service';
import { ListItemService } from '../../list-item/list-item.service';
import { BreadcrumbService } from 'src/app/app-shell/framework-services/breadcrumb.service';
import { AgGridBaseComponent } from 'src/app/app-shell/framework-components/ag-grid-base/ag-grid-base.component';
import { getCurrentMonth, getCurrentYear, months, weeks, years } from 'src/app/app-shell/framework-components/constants';
import { NotificationService } from 'src/app/app-shell/framework-services/notification.service';
import { AgGridToolsComponent } from 'src/app/app-shell/framework-components/ag-grid-tools/ag-grid-tools.component';

@Component({
  selector: 'app-daily-record-list-report',
  templateUrl: './daily-record-list-report.component.html'
})
export class DailyRecordListReportComponent extends AgGridBaseComponent implements OnInit {

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
    private readonly listItemService: ListItemService,
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
    this.breadCrumbService.setTitle('اطلاعات فرم روزانه جوشکاری')
    this.getSalons()
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

    this.columnDefs = [
      {
        field: 'date',
        headerName: 'تاریخ فرم',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'shift',
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
        field: 'salon',
        headerName: 'واحد کاری',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'machine',
        headerName: 'کد ماشین',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'head',
        headerName: 'شماره هد',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'personnelName',
        headerName: 'نام پرسنل',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'personnelFamily',
        headerName: 'نام خانوادگی پرسنل',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'personnelCode',
        headerName: 'کدپرسنلی',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'projectCode',
        headerName: 'کد پروژه',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'projectName',
        headerName: 'نام پروژه',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'taskMasterName',
        headerName: 'نام کارفرما',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'partGroupName',
        headerName: 'گروه قطعه',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'partName',
        headerName: 'نوع قطعه',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'partCode',
        headerName: 'کد قطعه',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'activityTypeName',
        headerName: 'نوع فعالیت/توقف',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'activityType',
        headerName: 'کد نوع',
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
        field: 'totalTimeByMin',
        headerName: 'کل زمان ثبت شده به دقیقه',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'gasTypeName',
        headerName: 'نوع گاز',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'powderTypeName',
        headerName: 'نوع پودر',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'wireTypeGroupName',
        headerName: 'گروه سیم',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'wireTypeName',
        headerName: 'نوع سیم',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'wireSize',
        headerName: 'سایز سیم',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'screw',
        headerName: 'بچ نامبر سیم',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'wireConsumption',
        headerName: 'مقدار مصرف سیم',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'description',
        headerName: 'شرح',
        filter: 'agSetColumnFilter'
      },
    ]

    this.reportService
      .getDailyRecordListReport(searchModel)
      .subscribe((data: []) => {
        this.records = data
      })
  }

}
