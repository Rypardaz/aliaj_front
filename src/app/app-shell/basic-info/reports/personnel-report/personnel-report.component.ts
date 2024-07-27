import { FormBuilder, FormGroup } from '@angular/forms'
import { Component, OnInit } from '@angular/core';
import { ReportService } from '../report.service';
import { AgGridBaseComponent } from 'src/app/app-shell/framework-components/ag-grid-base/ag-grid-base.component';
import { PersonnelService } from '../../personnel/personnel.service';
import { months, weeks } from 'src/app/app-shell/framework-components/constants'

@Component({
  selector: 'app-personnel-report',
  templateUrl: './personnel-report.component.html'
})
export class PersonnelReportComponent extends AgGridBaseComponent implements OnInit {

  columnDefs
  personnels = []
  weeks = weeks;
  months = months;
  records = []

  form: FormGroup

  constructor(private readonly fb: FormBuilder,
    private readonly personnelService: PersonnelService,
    private readonly reportService: ReportService) {
    super(false)

    this.form = fb.group({
      personnelGuid: ['E23CC6EE-93BD-4046-9330-703779AA1B7F'],
      weekId: [],
      monthId: [],
      fromDate: [],
      toDate: []
    })
  }

  override ngOnInit(): void {
    this.getPersonnels()

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
        field: 'partCode',
        headerName: 'کد قطعه',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'personnelTime',
        headerName: 'ساعت خالص در اختیار تولید',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'wireConsumption',
        headerName: 'سیم مصرفی واقعی',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'avgWireConsumption',
        headerName: 'میانگین مصرف واقعی',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'standartWireConsumptionPart',
        headerName: 'استاندارد مصرف قطعه',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'standartWireConsumption',
        headerName: 'مصرف استاندارد',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'consumptionPercent',
        headerName: 'راندمان',
        filter: 'agSetColumnFilter'
      },
    ]
  }

  getPersonnels() {
    this.personnelService
      .getForCombo<[]>()
      .subscribe(data => this.personnels = data)
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
      .getPersonnelReport(searchModel)
      .subscribe(data => {
        this.records = data
      })
  }

}
