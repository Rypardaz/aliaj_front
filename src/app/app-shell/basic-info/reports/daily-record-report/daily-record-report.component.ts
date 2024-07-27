import { FormBuilder, FormGroup } from '@angular/forms'
import { Component, OnInit } from '@angular/core';
import { ReportService } from '../report.service';
import { AgGridBaseComponent } from 'src/app/app-shell/framework-components/ag-grid-base/ag-grid-base.component';
import { SalonService } from '../../salon/salon.service';
import { ListItemService } from '../../list-item/list-item.service';

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

  form: FormGroup

  constructor(private readonly fb: FormBuilder,
    private readonly salonService: SalonService,
    private readonly listItemService: ListItemService,
    private readonly reportService: ReportService) {
    super(false)

    this.form = fb.group({
      salonGuid: ['30D49D6B-611B-46EA-AE4D-9ED842214C9B'],
      shiftGuid: [],
      fromDate: [],
      toDate: []
    })
  }

  override ngOnInit(): void {
    this.getSalons()
    this.getShifts()
    const salonGuid = this.getFormValue(this.form, 'salonGuid')
    this.reportService
      .getActivityNames(salonGuid)
      .subscribe(columns => {
        this.columns = columns

        this.columnDefs = [
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
            field: 'day',
            headerName: 'روز',
            filter: 'agSetColumnFilter'
          },
          {
            field: 'date',
            headerName: 'تاریخ',
            filter: 'agSetColumnFilter'
          },
          {
            field: 'shift',
            headerName: 'شیفت',
            filter: 'agSetColumnFilter'
          },
          {
            field: 'wireConsumption',
            headerName: 'میزان سیم مصرفی (کیلوگرم)',
            filter: 'agSetColumnFilter'
          },
          {
            field: 'weldingActivity',
            headerName: 'ساعت جوشکاری',
            filter: 'agSetColumnFilter'
          },
          {
            field: 'productionActivity',
            headerName: 'فعالیت های تولیدی',
            filter: 'agSetColumnFilter'
          },
          {
            field: 'productionStop',
            headerName: 'توقفات تولیدی',
            filter: 'agSetColumnFilter'
          }
        ]

        this.columns.forEach(column => {
          this.columnDefs.push({
            field: 'value' + column.colId,
            headerName: column.activityName,
            filter: 'agSetColumnFilter'
          })
        })

        this.columnDefs.push(
          {
            field: 'otherNonProductionStop',
            headerName: 'سایر توقفات غیر تولیدی',
            filter: 'agSetColumnFilter'
          },
          {
            field: 'reportTime',
            headerName: 'جمع ساعت در اختیار',
            filter: 'agSetColumnFilter'
          },
          {
            field: 'timeInProduction',
            headerName: 'خالص ساعت در اختیار تولید',
            filter: 'agSetColumnFilter'
          },
          {
            field: 'head',
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
      })
  }

  getSalons() {
    this.salonService
      .getForCombo<[]>()
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
    searchModel.type = 1

    if (!searchModel.shiftGuid)
      searchModel.shiftGuid = ''

    if (!searchModel.fromDate)
      searchModel.fromDate = ''

    if (!searchModel.toDate)
      searchModel.toDate = ''

    this.reportService
      .getMachineDailyRecordReport(searchModel)
      .subscribe(data => {
        this.records = data
      })
  }
}