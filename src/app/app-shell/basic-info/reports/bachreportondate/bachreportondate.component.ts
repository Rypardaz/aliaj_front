import { Component, OnInit } from '@angular/core';
import { ReportService } from '../report.service';
import { FormBuilder, FormGroup } from '@angular/forms'
import { SalonService } from '../../salon/salon.service';
import { BreadcrumbService } from 'src/app/app-shell/framework-services/breadcrumb.service';
import { AgGridBaseComponent } from 'src/app/app-shell/framework-components/ag-grid-base/ag-grid-base.component';
import { getCurrentMonth, getCurrentYear, months, weeks, years } from 'src/app/app-shell/framework-components/constants';
import { NotificationService } from 'src/app/app-shell/framework-services/notification.service';

@Component({
  selector: 'app-bachreportondate',
  templateUrl: './bachreportondate.component.html'
})
export class BachreportondateComponent extends AgGridBaseComponent implements OnInit {

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
    this.breadCrumbService.setTitle('گزارش بچ سیم و دستگاه')
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
        headerName: 'تاریخ',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'shiftName',
        headerName: 'شیفت',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'salonName',
        headerName: 'واحد کاری',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'machineName',
        headerName: 'نام دستگاه',
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
        field: 'partCode',
        headerName: 'کد قطعه',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'partGroupName',
        headerName: 'گروه قطعه',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'partType',
        headerName: 'نوع قطعه',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'wireTypeName',
        headerName: 'نام سیم',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'screw',
        headerName: 'بچ سیم',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'wireConsumption',
        headerName: 'مصرف سیم واقعی',
        filter: 'agSetColumnFilter'
      }
    ]

    this.reportService
      .GetBachReportOnDate(searchModel)
      .subscribe((data: []) => {
        this.records = data
      })
  }

}
