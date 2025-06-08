import { FormBuilder, FormGroup } from '@angular/forms'
import { Component, OnInit } from '@angular/core';
import { ReportService } from '../report.service';
import { AgGridBaseComponent } from 'src/app/app-shell/framework-components/ag-grid-base/ag-grid-base.component';
import { SalonService } from '../../salon/salon.service';
import { ListItemService } from '../../list-item/list-item.service';
import { BreadcrumbService } from 'src/app/app-shell/framework-services/breadcrumb.service';
import { getCurrentMonth, getCurrentYear, months, weeks, years } from 'src/app/app-shell/framework-components/constants';
import { ActivityService } from '../../activity/activity.service';
import { NotificationService } from 'src/app/app-shell/framework-services/notification.service';

@Component({
  selector: 'app-activity-report',
  templateUrl: './activity-report.component.html'
})
export class ActivityReportComponent extends AgGridBaseComponent implements OnInit {

  columnDefs
  salons = []
  sources = []
  columns = []
  weeks = weeks
  months = months
  years = years

  activitySubTypes = [
    { guid: 0, title: 'همه فعالیت ها و توقفات', type: 0 },
    { guid: 1, title: 'فعالیت جوشکاری', type: 1 },
    { guid: 2, title: 'فعالیت غیر جوشکاری', type: 2 },
    { guid: 3, title: 'توقف تولیدی', type: 3 },
    { guid: 4, title: 'توقف غیر تولیدی', type: 4 }
  ]

  records = []

  form: FormGroup

  constructor(private readonly fb: FormBuilder,
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
      activitySubType: [0],
      sourceGuid: [],
      weekIds: [],
      monthIds: [[month]],
      yearIds: [[year]],
      fromDate: [],
      toDate: []
    })
  }

  override ngOnInit(): void {
    this.breadCrumbService.setTitle('فعالیت ها / توقفات')
    this.getSalons()
    this.getSources()

    // this.form
    //   .get('salonGuid')
    //   .valueChanges
    //   .subscribe(salonGuid => this.getActivityNames(salonGuid))
  }

  getActivityNames(salonGuid) {
    // this.records = []

  }

  getSalons() {
    this.salonService
      .getForComboBySalonType(2)
      .subscribe(data => this.salons = data)
  }

  getSources() {
    this.listItemService
      .getForCombo<[]>('13')
      .subscribe(data => this.sources = data)
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
      .getActivityNamesForActivityReport(searchModel.salonGuid)
      .subscribe(columns => {
        this.columns = columns

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
          },
          {
            field: 'weldingTime',
            headerName: 'زمان خالص جوشکاری (h)',
            filter: 'agSetColumnFilter'
          }
        ]

        const activityCol = {
          headerName: 'فعالیت های غیرجوشکاری (h)',
          filter: 'agSetColumnFilter',
          children: []
        }

        this.columns
          .filter(x => x.type == 1)
          .forEach(column => {
            activityCol.children.push({
              field: 'pValue' + column.activityId,
              headerName: column.activityName,
              filter: 'agSetColumnFilter'
            })
          })

        this.columnDefs.push(activityCol)

        const stopCol = {
          headerName: 'توقفات از نوع تولیدی (h)',
          filter: 'agSetColumnFilter',
          children: []
        }

        this.columns
          .filter(x => x.type == 2)
          .forEach(column => {
            stopCol.children.push({
              field: 'spValue' + column.activityId,
              headerName: column.activityName,
              filter: 'agSetColumnFilter'
            })
          })

        this.columnDefs.push(stopCol)

        this.columnDefs.push(
          {
            field: 'productionTime',
            headerName: 'جمع فعالیت ها و توقفات تولیدی (h)',
            filter: 'agSetColumnFilter'
          }
        )

        const sourceCol = {
          headerName: 'جمع زمان توقفات غیر تولیدی به تفکیک منشا (h)',
          filter: 'agSetColumnFilter',
          children: []
        }

        this.columns
          .filter(x => x.type == 3)
          .forEach(column => {
            sourceCol.children.push({
              field: 'sValue' + column.activityId,
              headerName: column.activityName,
              filter: 'agSetColumnFilter'
            })
          })

        this.columnDefs.push(sourceCol)

        this.gridApi.redrawRows()
        this.gridApi.refreshCells()

        this.reportService
          .getActivityReport(searchModel)
          .subscribe((data: []) => {
            this.records = data
          })
      })
  }

  modalUpdated() {
    let columnsForAggregation = [
      { column: 'weldingTime', type: 'time' },
    ]

    this.columns
      .filter(x => x.type == 1)
      .forEach(column => {
        columnsForAggregation.push({
          column: 'pValue' + column.activityId,
          type: 'time'
        })
      })

    this.columns
      .filter(x => x.type == 2)
      .forEach(column => {
        columnsForAggregation.push({
          column: 'spValue' + column.activityId,
          type: 'time'
        })
      })

    columnsForAggregation.push({ column: 'productionTime', type: 'time' })

    this.columns
      .filter(x => x.type == 3)
      .forEach(column => {
        columnsForAggregation.push({
          column: 'sValue' + column.activityId,
          type: 'time'
        })
      })

    let pinnedRow = this.generatePinnedBottomData(columnsForAggregation)

    this.gridApi.setPinnedBottomRowData([pinnedRow])
  }

}
