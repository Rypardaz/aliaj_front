import { FormBuilder, FormGroup } from '@angular/forms'
import { Component, OnInit } from '@angular/core';
import { ReportService } from '../report.service';
import { AgGridBaseComponent } from 'src/app/app-shell/framework-components/ag-grid-base/ag-grid-base.component';
import { ProjectService } from '../../project/project.service';
import { ListItemService } from '../../list-item/list-item.service';

@Component({
  selector: 'app-project-report',
  templateUrl: './project-report.component.html'
})
export class ProjectReportComponent extends AgGridBaseComponent implements OnInit {

  columnDefs
  projects = []
  records = []

  form: FormGroup

  constructor(private readonly fb: FormBuilder,
    private readonly projectService: ProjectService,
    private readonly reportService: ReportService) {
    super(false)

    this.form = fb.group({
      projectGuid: ['F4E4480D-96E1-49B6-9B42-3474CA0D6E54'],
    })
  }

  override ngOnInit(): void {
    this.getProjects()
    const projectGuid = this.getFormValue(this.form, 'projectGuid')

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
        headerName: 'نفر ساعت تولید',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'standartWireConsumption',
        headerName: 'میزان مصرف سیم استاندارد',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'wireConsumption',
        headerName: 'میزان مصرف سیم واقعی',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'consumptionPercent',
        headerName: 'درصد پیشرفت قطعه',
        filter: 'agSetColumnFilter'
      },
    ]
  }

  getProjects() {
    this.projectService
      .getForCombo<[]>()
      .subscribe(data => this.projects = data)
  }

  getReport() {
    const searchModel = this.form.value

    this.reportService
      .getProjectReport(searchModel)
      .subscribe(data => {
        this.records = data
      })
  }
}
