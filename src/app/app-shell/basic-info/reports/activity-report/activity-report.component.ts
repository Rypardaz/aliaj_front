import { FormBuilder, FormGroup } from '@angular/forms'
import { Component, OnInit } from '@angular/core';
import { ReportService } from '../report.service';
import { AgGridBaseComponent } from 'src/app/app-shell/framework-components/ag-grid-base/ag-grid-base.component';
import { SalonService } from '../../salon/salon.service';
import { ListItemService } from '../../list-item/list-item.service';

@Component({
  selector: 'app-activity-report',
  templateUrl: './activity-report.component.html'
})
export class ActivityReportComponent extends AgGridBaseComponent implements OnInit {

  columnDefs
  salons = []
  sources = []
  activitySubTypes = [
    { guid: 1, title: 'فعالیت جوشکاری', type: 1 },
    { guid: 2, title: 'فعالیت غیر جوشکاری', type: 2 },
    { guid: 3, title: 'توقف تولیدی', type: 3 },
    { guid: 4, title: 'توقف غیر تولیدی', type: 4 }
  ];
  records = []

  form: FormGroup

  constructor(private readonly fb: FormBuilder,
    private readonly salonService: SalonService,
    private readonly listItemService: ListItemService,
    private readonly reportService: ReportService) {
    super(false)

    this.form = fb.group({
      salonGuid: ['30D49D6B-611B-46EA-AE4D-9ED842214C9B'],
      activitySubType: [1],
      sourceGuid: [],
      weekId: [],
      monthId: [],
      fromDate: [],
      toDate: []
    })
  }

  override ngOnInit(): void {
    this.getSalons()
    this.getSources()
    const salonGuid = this.getFormValue(this.form, 'salonGuid')

    this.columnDefs = [
      {
        field: 'activity',
        headerName: 'فعالیت',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'activityTime',
        headerName: 'ساعت فعالیت',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'activityPercent',
        headerName: 'درصد فعالیت',
        filter: 'agSetColumnFilter'
      },
    ]
  }

  getSalons() {
    this.salonService
      .getForCombo<[]>()
      .subscribe(data => this.salons = data)
  }

  getSources() {
    this.listItemService
      .getForCombo<[]>('13')
      .subscribe(data => this.sources = data)
  }

  getReport() {
    const searchModel = this.form.value

    if (!searchModel.sourceGuid)
      searchModel.sourceGuid = ''

    if (!searchModel.weekId)
      searchModel.weekId = ''

    if (!searchModel.monthId)
      searchModel.monthId = ''

    if (!searchModel.fromDate)
      searchModel.fromDate = ''

    if (!searchModel.toDate)
      searchModel.toDate = ''

    this.reportService
      .getActivityReport(searchModel)
      .subscribe(data => {
        this.records = data
      })
  }
}
