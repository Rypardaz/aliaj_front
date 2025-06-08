import { FormBuilder, FormGroup } from '@angular/forms'
import { Component, OnInit } from '@angular/core';
import { ReportService } from '../report.service';
import { AgGridBaseComponent } from 'src/app/app-shell/framework-components/ag-grid-base/ag-grid-base.component';
import { SalonService } from '../../salon/salon.service';
import { ListItemService } from '../../list-item/list-item.service';
import * as _ from 'lodash'
import { BreadcrumbService } from 'src/app/app-shell/framework-services/breadcrumb.service';
import { ActivatedRoute } from '@angular/router';
import { getCurrentMonth, getCurrentYear, months, weeks, years } from 'src/app/app-shell/framework-components/constants';
import { NotificationService } from 'src/app/app-shell/framework-services/notification.service';
import * as moment from 'jalali-moment';

@Component({
  selector: 'app-wire-type-consumption-report',
  templateUrl: './wire-type-consumption-report.component.html'
})
export class WireTypeConsumptionReportComponent extends AgGridBaseComponent implements OnInit {

  columnDefs

  salons = []
  shifts = []
  records = []

  weeks = weeks
  months = months
  years = years

  titles = []
  wireTypes = []
  type

  pivotTitle = ''
  form: FormGroup

  constructor(private readonly fb: FormBuilder,
    private readonly salonService: SalonService,
    private readonly listItemService: ListItemService,
    private readonly reportService: ReportService,
    private readonly breadCrumbService: BreadcrumbService,
    private readonly notificationService: NotificationService,
    private readonly activatedRoute: ActivatedRoute) {
    super(false)

    const month = getCurrentMonth()
    const year = getCurrentYear()

    this.form = fb.group({
      type: [],
      salonGuid: [],
      shiftGuid: [],
      weekIds: [],
      monthIds: [[month]],
      yearIds: [[year]],
      fromDate: [],
      toDate: []
    })
  }

  override ngOnInit(): void {
    this.type = this.activatedRoute.snapshot.paramMap.get('type')
    this.setFormValue(this.form, 'type', this.type)

    let title = 'مصرف سیم '
    let header = 'تاریخ'
    if (this.type == '1') {
      title += 'روزانه'
      this.pivotTitle = 'تاریخ'
    } else if (this.type == '2') {
      title += 'هفتگی'
      header = 'شماره هفته'
      this.pivotTitle = 'شماره هفته'
    } else {
      title += 'ماهانه'
      header = 'ماه'
      this.pivotTitle = 'ماه'
    }

    this.getSalons()
    this.getShifts()

    this.breadCrumbService.setTitle(title)

    this.columnDefs = [
      {
        field: 'year',
        headerName: 'سال',
        filter: 'agSetColumnFilter',
        hide: true
      },
      {
        field: 'month',
        headerName: 'ماه',
        filter: 'agSetColumnFilter',
        hide: true
      },
      {
        field: 'title',
        headerName: header,
        filter: 'agSetColumnFilter',
      },
      {
        field: 'day',
        headerName: 'روز',
        filter: 'agSetColumnFilter',
        hide: true
      },
      {
        field: 'shiftTitle',
        headerName: 'شیفت',
        filter: 'agSetColumnFilter',
        hide: true
      },
      {
        field: 'wireType',
        headerName: 'نوع سیم',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'wireConsumption',
        headerName: 'مصرف سیم (kg)',
        filter: 'agSetColumnFilter'
      }
    ]
  }

  getSalons() {
    this.salonService
      .getForComboBySalonType(2)
      .subscribe(data => this.salons = data)
  }

  getShifts() {
    this.listItemService
      .getForCombo<[]>('10')
      .subscribe(data => this.shifts = data)
  }

  getReport() {
    const searchModel = this.form.value

    if (!searchModel.salonGuid) {
      this.notificationService.error('لطفا برای دریافت گزارش سالن را انتخاب نمایید.')
      return
    }

    if (!searchModel.yearIds.length) {
      this.notificationService.error('لطفا برای دریافت گزارش سال را انتخاب نمایید.')
      return
    }

    this.reportService
      .getWireTypeConsumptionReport(searchModel)
      .subscribe((data: []) => {
        this.records = data

        this.titles = _(data).groupBy('title')
          .map((value, key) => ({ title: key, value: value }))
          .value()

        this.wireTypes = _(data).groupBy('wireType')
          .map((value, key) => ({ wireType: key, value: value }))
          .value()
      })
  }

  getWireConsumption(title, wireType) {
    const records = this.records.filter(x => x.title == title && x.wireType == wireType)
    if (records.length)
      return records.reduce((a, b) => a + b.wireConsumption, 0)

    return '-'
  }

  getRowSum(title) {
    return this.records
      .filter(x => x.title == title)
      .reduce((a, b) => a + b.wireConsumption, 0)
  }

  getSumCol(wireType) {
    return this.records
      .filter(x => x.wireType == wireType)
      .reduce((a, b) => a + b.wireConsumption, 0)
  }

  getSumTotal() {
    return this.records
      .reduce((a, b) => a + b.wireConsumption, 0)
  }
}