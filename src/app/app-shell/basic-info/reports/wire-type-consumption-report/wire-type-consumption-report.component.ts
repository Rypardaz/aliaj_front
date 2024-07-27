import { FormBuilder, FormGroup } from '@angular/forms'
import { Component, OnInit } from '@angular/core';
import { ReportService } from '../report.service';
import { AgGridBaseComponent } from 'src/app/app-shell/framework-components/ag-grid-base/ag-grid-base.component';
import { SalonService } from '../../salon/salon.service';
import { ListItemService } from '../../list-item/list-item.service';

@Component({
  selector: 'app-wire-type-consumption-report',
  templateUrl: './wire-type-consumption-report.component.html'
})
export class WireTypeConsumptionReportComponent extends AgGridBaseComponent implements OnInit {

  columnDefs

  salons = []
  shifts = []
  types = [
    { id: 1, title: 'روزانه' },
    { id: 2, title: 'هفتگی' },
    { id: 3, title: 'ماهانه' },
  ]
  records = []

  form: FormGroup

  constructor(private readonly fb: FormBuilder,
    private readonly salonService: SalonService,
    private readonly listItemService: ListItemService,
    private readonly reportService: ReportService) {
    super(false)

    this.form = fb.group({
      type: [],
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

    this.columnDefs = [
      {
        field: 'title',
        headerName: 'تیتر',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'wireType',
        headerName: 'نوع سیم',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'wireConsumption',
        headerName: 'مصرف سیم',
        filter: 'agSetColumnFilter'
      },
    ]
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

  getReport() {
    const searchModel = this.form.value

    if (!searchModel.shiftGuid)
      searchModel.shiftGuid = ''

    if (!searchModel.fromDate)
      searchModel.fromDate = ''

    if (!searchModel.toDate)
      searchModel.toDate = ''

    this.reportService
      .getWireTypeConsumptionReport(searchModel)
      .subscribe(data => {
        this.records = data
      })
  }
}
