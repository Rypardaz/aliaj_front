import { FormBuilder, FormGroup } from '@angular/forms'
import { Component, OnInit } from '@angular/core';
import { ReportService } from '../report.service';
import { AgGridBaseComponent } from 'src/app/app-shell/framework-components/ag-grid-base/ag-grid-base.component';
import { SalonService } from '../../salon/salon.service';

@Component({
  selector: 'app-by-part-report',
  templateUrl: './by-part-report.component.html'
})
export class ByPartReportComponent extends AgGridBaseComponent implements OnInit {

  columnDefs
  salons = []
  records = []

  form: FormGroup

  constructor(private readonly fb: FormBuilder,
    private readonly salonService: SalonService,
    private readonly reportService: ReportService) {
    super(false)

    this.form = fb.group({
      salonGuid: ['30D49D6B-611B-46EA-AE4D-9ED842214C9B'],
      weekId: [],
      monthId: [],
      fromDate: [],
      toDate: []
    })
  }

  override ngOnInit(): void {
    this.getSalons()
    const salonGuid = this.getFormValue(this.form, 'salonGuid')

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
        headerName: 'کل ساعت گزارش شده تولید',
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
        headerName: 'درصد از زمان کل',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'wireConsumption',
        headerName: 'میزان مصرف سیم جوش (کیلوگرم)',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'wireConsumptionPercent',
        headerName: 'درصد از مصرف کل',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'avgConsumption',
        headerName: 'میانگین مصرف',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'standardWireConsumption',
        headerName: 'استاندارد',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'standardProduction',
        headerName: 'تولید استاندارد',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'randeman',
        headerName: 'راندمان',
        filter: 'agSetColumnFilter'
      },
    ]
  }

  getSalons() {
    this.salonService
      .getForCombo<[]>()
      .subscribe(data => this.salons = data)
  }

  getReport() {
    const searchModel = this.form.value

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
