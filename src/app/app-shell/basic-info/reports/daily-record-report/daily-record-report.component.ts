import { FormBuilder, FormGroup } from '@angular/forms'
import { Component, OnInit } from '@angular/core';
import { ReportService } from '../report.service';
import { AgGridBaseComponent } from 'src/app/app-shell/framework-components/ag-grid-base/ag-grid-base.component';
import { SalonService } from '../../salon/salon.service';
import { ListItemService } from '../../list-item/list-item.service';
import { BreadcrumbService } from 'src/app/app-shell/framework-services/breadcrumb.service';
import { NotificationService } from 'src/app/app-shell/framework-services/notification.service';
import { ActivatedRoute } from '@angular/router';
import { getCurrentMonth, getCurrentYear, getTodayDate, months, weeks, years } from 'src/app/app-shell/framework-components/constants';
import * as moment from 'jalali-moment';

@Component({
  selector: 'app-daily-record-report',
  templateUrl: './daily-record-report.component.html'
})
export class DailyRecordReportComponent extends AgGridBaseComponent implements OnInit {

  columnDefs

  salons = []
  shifts = []
  columns = []
  records = []
  type
  weeks = weeks
  months = months
  years = years
  currentMonth;

  form: FormGroup

  constructor(fb: FormBuilder,
    private readonly activatedRoute: ActivatedRoute,
    private readonly notificationService: NotificationService,
    private readonly salonService: SalonService,
    private readonly listItemService: ListItemService,
    private readonly reportService: ReportService,
    private readonly breadCrumbService: BreadcrumbService) {
    super(false)

    this.currentMonth = getCurrentMonth()
    const year = getCurrentYear()

    this.form = fb.group({
      salonGuid: [],
      weekIds: [],
      monthIds: [],
      yearIds: [[year]],
      fromDate: [],
      toDate: [],
      type: []
    })
  }

  override ngOnInit(): void {
    this.getSalons()
    this.getShifts()

    this.type = this.activatedRoute.snapshot.paramMap.get('type')
    this.setFormValue(this.form, 'type', this.type)

    switch (this.type) {
      case '1':
        this.breadCrumbService.setTitle('خلاصه گزارش روزانه')
        this.setFormValue(this.form, 'monthIds', [this.currentMonth])
        break;
      case '2':
        this.breadCrumbService.setTitle('خلاصه گزارش هفتگی')
        this.setFormValue(this.form, 'weekIds', [moment().jWeek() - 1]);
        break;
      case '3':
        this.breadCrumbService.setTitle('خلاصه گزارش ماهانه')
        this.setFormValue(this.form, 'monthIds', [this.currentMonth])
        break;
    }
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

  getColumns() {

  }

  getReport() {
    const searchModel = this.form.value

    if (!searchModel.salonGuid) {
      this.notificationService.error('لطفا برای دریافت گزارش ابتدا سالن را انتخاب نمایید.')
      return
    }

    if (!searchModel.yearIds.length) {
      this.notificationService.error('لطفا برای دریافت گزارش ابتدا سال را انتخاب نمایید.')
      return
    }

    this.reportService
      .getActivityNames(searchModel.salonGuid)
      .subscribe(columns => {
        this.columns = columns

        switch (this.type) {
          case '1':
            this.breadCrumbService.setTitle('خلاصه گزارش روزانه')
            this.columnDefs = [
              {
                field: 'date',
                headerName: 'تاریخ',
                filter: 'agSetColumnFilter'
              },
              {
                field: 'day',
                headerName: 'روز',
                filter: 'agSetColumnFilter'
              },
              {
                field: 'shift',
                headerName: 'شیفت',
                filter: 'agSetColumnFilter'
              }
            ]

            break;
          case '2':
            this.breadCrumbService.setTitle('خلاصه گزارش هفتگی')
            this.columnDefs = [
              {
                field: 'year',
                headerName: 'سال',
                filter: 'agSetColumnFilter'
              },
              {
                field: 'week',
                headerName: 'هفته',
                filter: 'agSetColumnFilter'
              }
            ]

            break;
          case '3':
            this.breadCrumbService.setTitle('خلاصه گزارش ماهانه')
            this.columnDefs = [
              {
                field: 'year',
                headerName: 'سال',
                filter: 'agSetColumnFilter'
              },
              {
                field: 'month',
                headerName: 'ماه',
                filter: 'agSetColumnFilter'
              }
            ]
            break;
        }

        const activityCol = {
          headerName: 'فعالیت ها',
          filter: 'agSetColumnFilter',
          children: []
        }

        this.columns
          .forEach(column => {
            activityCol.children.push({
              field: 'value' + column.activityId,
              headerName: column.activityName + ' (kg)',
              filter: 'agSetColumnFilter'
            })
          })

        this.columnDefs.push(activityCol)

        this.columnDefs.push(
          {
            field: 'wireConsumption',
            headerName: 'جمع سیم مصرفی (kg)',
            filter: 'agSetColumnFilter',
          },
          {
            field: 'weldingTime',
            headerName: 'زمان خالص جوشکاری (h)',
            filter: 'agSetColumnFilter'
          },
          {
            field: 'randeman',
            headerName: 'راندمان جوشکاری (%)',
            filter: 'agSetColumnFilter'
          },
          {
            field: 'productionActivityTime',
            headerName: 'زمان فعالیت های تولیدی (h)',
            filter: 'agSetColumnFilter'
          },
          {
            field: 'productionStopTime',
            headerName: 'زمان توقفات تولیدی (h)',
            filter: 'agSetColumnFilter'
          },
          {
            field: 'productionTime',
            headerName: 'جمع فعالیت ها و توقفات تولیدی (h)',
            filter: 'agSetColumnFilter'
          },
          {
            field: 'maintenanceStoppageTime',
            headerName: 'زمان توقفات تعمیراتی (h)',
            filter: 'agSetColumnFilter'
          },
          {
            field: 'unMaintenanceStoppageTime',
            headerName: 'زمان سایر توقفات غیرتولیدی (h)',
            filter: 'agSetColumnFilter'
          },
          {
            field: 'totalHoursReported',
            headerName: 'جمع ساعت گزارش شده توسط تولید (h)',
            filter: 'agSetColumnFilter'
          },
          {
            field: 'netHoursInProduce',
            headerName: 'خالص ساعت در اختیار تولید (h)',
            filter: 'agSetColumnFilter'
          },
          {
            field: 'headCount',
            headerName: 'تعداد هد جوشکاری',
            filter: 'agSetColumnFilter'
          },
          {
            field: 'realHead',
            headerName: 'تعداد هد واقعی در اختیار تولید',
            filter: 'agSetColumnFilter'
          }
        )

        this.gridApi.redrawRows()
        this.gridApi.refreshCells()

        this.reportService
          .getDailyRecordReport(searchModel)
          .subscribe((data: []) => {
            this.records = data
          })
      })
  }

  modalUpdated() {
    let columnsForAggregation = [
      { column: 'wireConsumption', type: 'sum' },
      { column: 'weldingTime', type: 'time' },
      { column: 'randeman', type: 'sum' },
      { column: 'productionActivityTime', type: 'time' },
      { column: 'productionStopTime', type: 'time' },
      { column: 'productionTime', type: 'time' },
      { column: 'maintenanceStoppageTime', type: 'time' },
      { column: 'unMaintenanceStoppageTime', type: 'time' },
      { column: 'totalHoursReported', type: 'time' },
      { column: 'netHoursInProduce', type: 'time' },
      { column: 'headCount', type: 'avg' },
      { column: 'realHead', type: 'avg' }
    ]

    this.columns
      .forEach(column => {
        columnsForAggregation.push({
          column: 'value' + column.activityId,
          type: 'sum'
        })
      })

    let pinnedRow = this.generatePinnedBottomData(columnsForAggregation)

    this.gridApi.setPinnedBottomRowData([pinnedRow])
  }
}