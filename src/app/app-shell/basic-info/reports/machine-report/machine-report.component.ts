import { Component, OnInit } from '@angular/core';
import { ReportService } from '../report.service';
import { FormBuilder, FormGroup } from '@angular/forms'
import { SalonService } from '../../salon/salon.service';
import { ListItemService } from '../../list-item/list-item.service';
import { BreadcrumbService } from 'src/app/app-shell/framework-services/breadcrumb.service';
import { AgGridBaseComponent } from 'src/app/app-shell/framework-components/ag-grid-base/ag-grid-base.component';
import { getCurrentMonth, getCurrentYear, months, weeks, years } from 'src/app/app-shell/framework-components/constants';
import { NotificationService } from 'src/app/app-shell/framework-services/notification.service';
import * as moment from 'jalali-moment';

@Component({
  selector: 'app-machine-report',
  templateUrl: './machine-report.component.html'
})
export class MachineReportComponent extends AgGridBaseComponent implements OnInit {

  columnDefs
  salons = []
  shifts = []
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
    const week = moment().jWeek()
    
    console.log(week)

    this.form = fb.group({
      salonGuid: [],
      shiftGuid: [],
      yearIds: [[year]],
      weekIds: [],
      monthIds: [[month]],
      fromDate: [],
      toDate: [],
      type: [4]
    })
  }

  override ngOnInit(): void {
    this.breadCrumbService.setTitle('عملکرد ماشین آلات')
    this.getSalons()
    this.getShifts()
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

    if (!searchModel.yearIds) {
      this.notificationService.error('لطفا برای دریافت گزارش سال را انتخاب نمایید.')
      return
    }

    this.reportService
      .getActivityNamesForMachineReport(searchModel.salonGuid)
      .subscribe(columns => {
        this.columns = columns

        this.columnDefs = [
          {
            field: 'date',
            headerName: 'تاریخ',
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
            field: 'weldingTime',
            headerName: 'مجموع زمان خالص جوشکاری (h)',
            filter: 'agSetColumnFilter'
          },
          {
            field: 'wireConsumption',
            headerName: 'مجموع مصرف سیم (KG)',
            filter: 'agSetColumnFilter'
          },
          {
            field: 'productionActivityTime',
            headerName: 'مجموع زمان فعالیت تولیدی (h)',
            filter: 'agSetColumnFilter'
          },
          {
            field: 'productionStopTime',
            headerName: 'مجموع زمان توقفات تولیدی (h)',
            filter: 'agSetColumnFilter'
          },
          {
            field: 'nonProductionStopTime',
            headerName: 'مجموع زمان توقفات غیر تولیدی (h)',
            filter: 'agSetColumnFilter'
          }
        ]

        const activityCol = {
          headerName: 'تفکیک توقفات با منشا تعمیراتی (h)',
          filter: 'agSetColumnFilter',
          children: []
        }

        this.columns
          .filter(x => x.type == 1)
          .forEach(column => {
            activityCol.children.push({
              field: 'mValue' + column.activityId,
              headerName: column.activityName,
              filter: 'agSetColumnFilter'
            })
          })

        this.columnDefs.push(activityCol)

        this.columnDefs.push(
          {
            field: 'maintenanceStoppageTime',
            headerName: 'مجموع توقفات تعمیراتی(h)',
            filter: 'agSetColumnFilter'
          }
        )

        const stopCol = {
          headerName: 'تفکیک توقفات با منشا سایر (h)',
          filter: 'agSetColumnFilter',
          children: []
        }

        this.columns
          .filter(x => x.type == 2)
          .forEach(column => {
            stopCol.children.push({
              field: 'oValue' + column.activityId,
              headerName: column.activityName,
              filter: 'agSetColumnFilter'
            })
          })

        this.columnDefs.push(stopCol)

        this.columnDefs.push(
          {
            field: 'otherStoppageTime',
            headerName: 'مجموع توقفات سایر (h)',
            filter: 'agSetColumnFilter'
          }
        )

        this.reportService
          .getMachineReport(searchModel)
          .subscribe((data: []) => {
            this.records = data
          })
      })
  }

  modalUpdated() {
    let columnsForAggregation = [
      { column: 'weldingTime', type: 'sum' },
      { column: 'wireConsumption', type: 'sum' },
      { column: 'productionActivityTime', type: 'sum' },
      { column: 'productionStopTime', type: 'sum' },
      { column: 'nonProductionStopTime', type: 'sum' },
    ]

    this.columns
      .filter(x => x.type == 1)
      .forEach(column => {
        columnsForAggregation.push({
          column: 'mValue' + column.activityId,
          type: 'sum'
        })
      })

    columnsForAggregation.push({ column: 'maintenanceStoppageTime', type: 'sum' })

    this.columns
      .filter(x => x.type == 2)
      .forEach(column => {
        columnsForAggregation.push({
          column: 'oValue' + column.activityId,
          type: 'sum'
        })
      })

    columnsForAggregation.push({ column: 'otherStoppageTime', type: 'sum' })

    let pinnedRow = this.generatePinnedBottomData(columnsForAggregation)
    this.gridApi.setPinnedBottomRowData([pinnedRow])
  }
}
