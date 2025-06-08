import { Component, OnInit } from '@angular/core';
import { ReportService } from '../report.service';
import { FormBuilder, FormGroup } from '@angular/forms'
import { ProjectService } from '../../project/project.service';
import { BreadcrumbService } from 'src/app/app-shell/framework-services/breadcrumb.service';
import { AgGridBaseComponent } from 'src/app/app-shell/framework-components/ag-grid-base/ag-grid-base.component';

@Component({
  selector: 'app-project-report',
  templateUrl: './project-report.component.html'
})
export class ProjectReportComponent extends AgGridBaseComponent implements OnInit {

  columnDefs
  projects = []
  records = []
  columns = []

  form: FormGroup

  constructor(private readonly fb: FormBuilder,
    private readonly projectService: ProjectService,
    private readonly reportService: ReportService,
    private readonly breadCrumbService: BreadcrumbService) {
    super(false)

    this.form = fb.group({
      projectGuid: [],
      fromDate: [],
      toDate: []
    })
  }

  override ngOnInit(): void {
    this.breadCrumbService.setTitle('عملکرد پروژه')
    this.getProjects()
  }

  getProjects() {
    this.projectService
      .getForCombo<[]>()
      .subscribe(data => this.projects = data)
  }

  getReport() {
    const searchModel = this.form.value

    this.reportService
      .getProjectWireTypes(searchModel)
      .subscribe((columns: any) => {
        this.columns = columns

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
            headerName: 'نفر ساعت تولید (h)',
            filter: 'agSetColumnFilter'
          },
          {
            field: 'personnelStandardTime',
            headerName: 'نفر ساعت استاندارد (h)',
            filter: 'agSetColumnFilter'
          },
          {
            field: 'randeman',
            headerName: 'راندمان',
            filter: 'agSetColumnFilter'
          }
        ]

        this.columns.forEach(column => {
          this.columnDefs.push({
            field: 'value' + column.wireTypeId,
            headerName: column.wireTypeName,
            filter: 'agSetColumnFilter'
          })
        })

        this.columnDefs.push(
          {
            field: 'standartWireConsumption',
            headerName: 'میزان مصرف سیم استاندارد (kg/h)',
            filter: 'agSetColumnFilter'
          },
          {
            field: 'wireConsumption',
            headerName: 'میزان مصرف سیم (kg)',
            filter: 'agSetColumnFilter'
          },
          {
            field: 'consumptionPercent',
            headerName: 'درصد پیشرفت قطعه (%)',
            valueFormatter: p => p.value + ' % ',
            filter: 'agSetColumnFilter'
          }
        )

        this.reportService
          .getProjectReport(searchModel)
          .subscribe((data: []) => {
            this.records = data
          })
      })
  }

  modalUpdated() {
    let columnsForAggregation = [
      { column: 'personnelTime', type: 'sum' },
      { column: 'personnelStandardTime', type: 'sum' },
      // { column: 'randeman', type: 'sum' },
      { column: 'standartWireConsumption', type: 'sum' },
      { column: 'productionStopTime', type: 'sum' },
      { column: 'wireConsumption', type: 'sum' },
      // { column: 'consumptionPercent', type: 'sum' }
    ]

    let pinnedRow = this.generatePinnedBottomData(columnsForAggregation)

    this.gridApi.setPinnedBottomRowData([pinnedRow])
  }
}
