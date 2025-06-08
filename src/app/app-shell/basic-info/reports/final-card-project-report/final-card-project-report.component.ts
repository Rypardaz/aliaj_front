import { Component, OnInit } from '@angular/core';
import { ReportService } from '../report.service';
import { FormBuilder, FormGroup } from '@angular/forms'
import { SalonService } from '../../salon/salon.service';
import { ListItemService } from '../../list-item/list-item.service';
import { BreadcrumbService } from 'src/app/app-shell/framework-services/breadcrumb.service';
import { AgGridBaseComponent } from 'src/app/app-shell/framework-components/ag-grid-base/ag-grid-base.component';
import { getCurrentMonth, getCurrentYear, months, weeks, years } from 'src/app/app-shell/framework-components/constants';
import { NotificationService } from 'src/app/app-shell/framework-services/notification.service';
import { ProjectService } from '../../project/project.service';

@Component({
  selector: 'app-final-card-project-report',
  templateUrl: './final-card-project-report.component.html'
})
export class FinalCardProjectReportComponent extends AgGridBaseComponent implements OnInit {

  columnDefs
  salons = []
  shifts = []
  records = []
  columns = []
  projects = []
  years = years
  weeks = weeks
  months = months
  form: FormGroup

  constructor(readonly fb: FormBuilder,
    private readonly projectService: ProjectService,
    private readonly reportService: ReportService,
    private readonly notificationService: NotificationService,
    private readonly breadCrumbService: BreadcrumbService) {
    super(false)

    this.form = fb.group({
      projectGuid: ''
    })
  }

  override ngOnInit(): void {
    this.breadCrumbService.setTitle('کارت پروژه')

    this.getProjects()
  }

  getProjects() {
    this.projectService
      .getForCombo()
      .subscribe((data: []) => {
        this.projects = data
      })
  }

  getReport() {
    const searchModel = this.form.value

    if (!searchModel.projectGuid) {
      this.notificationService.error('لطفا برای دریافت گزارش پروژه را انتخاب نمایید.')
      return
    }

    this.columnDefs = [
      {
        field: 'reportDate',
        headerName: 'تاریخ گزارش',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'projectCode',
        headerName: 'کد پروژه',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'projectName',
        headerName: 'نام پروژه',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'projectType',
        headerName: 'نوع پروژه',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'salon',
        headerName: 'واحد',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'taskMaster',
        headerName: 'صاحبکار',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'startDate',
        headerName: 'تاریخ شروع',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'endDate',
        headerName: 'تاریخ خاتمه',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'projectDeliveryDate',
        headerName: 'تاریخ تحویل',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'description',
        headerName: 'شرح',
        filter: 'agSetColumnFilter'
      },
    ]

    this.reportService
      .getFinalCardProject(searchModel)
      .subscribe((data: []) => {
        this.records = data
      })

  }
}
