import { Component, OnInit } from '@angular/core';
import { ReportService } from '../report.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { ProjectService } from '../../project/project.service';
import { BreadcrumbService } from 'src/app/app-shell/framework-services/breadcrumb.service';
import { AgGridBaseComponent } from 'src/app/app-shell/framework-components/ag-grid-base/ag-grid-base.component';
import { AgGridModule } from 'ag-grid-angular';
import { LabelIconButtonComponent } from '../../../framework-components/custom-buttons/label-icon-button.component';

import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-project-report',
  templateUrl: './project-report.component.html',
  imports: [FormsModule, ReactiveFormsModule, NgSelectModule, LabelIconButtonComponent, AgGridModule]
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
    super()

    this.form = fb.group({
      projectGuid: [],
      fromDate: [],
      toDate: []
    })
  }

  override async ngOnInit(): Promise<void> {
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
            filter: 'agSetColumnFilter',
            aggFunc: 'sum'
          },
          {
            field: 'personnelStandardTime',
            headerName: 'نفر ساعت استاندارد (h)',
            filter: 'agSetColumnFilter',
            aggFunc: 'sum'
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
            filter: 'agSetColumnFilter',
            aggFunc: 'sum'
          },
          {
            field: 'wireConsumption',
            headerName: 'میزان مصرف سیم (kg)',
            filter: 'agSetColumnFilter',
            aggFunc: 'sum'
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
}
