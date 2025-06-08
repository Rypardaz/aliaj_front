import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ReportService } from '../report.service';
import { FormBuilder, FormGroup } from '@angular/forms'
import { MachineService } from '../../machine/machine.service';
import { months, weeks, years } from 'src/app/app-shell/framework-components/constants';
import { BreadcrumbService } from 'src/app/app-shell/framework-services/breadcrumb.service';
import { NotificationService } from 'src/app/app-shell/framework-services/notification.service';
import { AgGridBaseComponent } from 'src/app/app-shell/framework-components/ag-grid-base/ag-grid-base.component';
import { ListItemService } from '../../list-item/list-item.service';

@Component({
  selector: 'app-data-logger-report',
  templateUrl: './data-logger-report.component.html'
})
export class DataLoggerReportComponent extends AgGridBaseComponent implements OnInit {

  columnDefs

  machines = []
  columns = []
  records = []
  shifts = [
    { id: 'Morning', title: 'روز' },
    { id: 'Night', title: 'شب' },
    { id: 'All', title: 'روز و شب' }
  ]

  months = months
  years = years
  type

  form: FormGroup

  constructor(fb: FormBuilder,
    private readonly activatedRoute: ActivatedRoute,
    private readonly notificationService: NotificationService,
    private readonly listItemService: ListItemService,
    private readonly machineService: MachineService,
    private readonly reportService: ReportService,
    private readonly breadCrumbService: BreadcrumbService) {
    super(false)

    this.form = fb.group({
      shift: [this.shifts[2].id],
      machineGuid: [],
      specificDate: [],
      yearId: [],
      monthId: []
    })
  }

  override ngOnInit(): void {
    this.getMachines()

    this.type = this.activatedRoute.snapshot.paramMap.get('type')

    switch (this.type) {
      case '1':
        this.breadCrumbService.setTitle('مقادیر داده')
        this.columnDefs = [
          {
            field: 'dl_Num',
            headerName: 'Dl_Num',
            filter: 'agSetColumnFilter'
          },
          {
            field: 'date_Time',
            headerName: 'DateTime',
            filter: 'agSetColumnFilter'
          },
          {
            field: 'voltage1',
            headerName: 'Voltage1',
            filter: 'agSetColumnFilter'
          },
          {
            field: 'amper_1',
            headerName: 'Amper_1',
            filter: 'agSetColumnFilter'
          },
          {
            field: 'onTime_H1',
            headerName: 'OnTime_H1',
            filter: 'agSetColumnFilter'
          },
          {
            field: 'wTime_H1',
            headerName: 'WTime_H1',
            filter: 'agSetColumnFilter'
          },
          {
            field: 'rPM',
            headerName: 'RPM',
            filter: 'agSetColumnFilter'
          },
          {
            field: 'voltage2',
            headerName: 'Voltage2',
            filter: 'agSetColumnFilter'
          },
          {
            field: 'amper_2',
            headerName: 'Amper_2',
            filter: 'agSetColumnFilter'
          },
          {
            field: 'onTime_H2',
            headerName: 'OnTime_H2',
            filter: 'agSetColumnFilter'
          },
          {
            field: 'wTime_H2',
            headerName: 'WTime_H2',
            filter: 'agSetColumnFilter'
          },
          {
            field: 'totalTime',
            headerName: 'TotalTime',
            filter: 'agSetColumnFilter'
          }
        ]

        break;
      case '2':
        this.breadCrumbService.setTitle('زمان جوشکاری روزانه')
        this.columnDefs = [
          {
            field: 'date_Time',
            headerName: 'DateTime',
            filter: 'agSetColumnFilter'
          },
          {
            field: 'dayOfWeek',
            headerName: 'DayOfWeek',
            filter: 'agSetColumnFilter'
          },
          {
            field: 'shiftWork',
            headerName: 'ShiftWork',
            filter: 'agSetColumnFilter'
          },
          {
            field: 'totalTime',
            headerName: 'TotalTime',
            filter: 'agSetColumnFilter'
          },
          {
            field: 'onTime_H1',
            headerName: 'OnTime_H1',
            filter: 'agSetColumnFilter'
          },
          {
            field: 'wTime_H1',
            headerName: 'WTime_H1',
            filter: 'agSetColumnFilter'
          },
          {
            field: 'avgVoltage_H1',
            headerName: 'AvgVoltage_H1',
            filter: 'agSetColumnFilter'
          },
          {
            field: 'avgCurrent_H1',
            headerName: 'AvgCurrent_H1',
            filter: 'agSetColumnFilter'
          },
          {
            field: 'upTime_H1',
            headerName: 'UpTime_H1',
            filter: 'agSetColumnFilter'
          },
          {
            field: 'efficiency_H1',
            headerName: 'Efficiency_H1',
            filter: 'agSetColumnFilter'
          },
          {
            field: 'powerH1_KWh',
            headerName: 'PowerH1_KWh',
            filter: 'agSetColumnFilter'
          },
          {
            field: 'onTime_H2',
            headerName: 'OnTime_H2',
            filter: 'agSetColumnFilter'
          },
          {
            field: 'wTime_H2',
            headerName: 'WTime_H2',
            filter: 'agSetColumnFilter'
          },
          {
            field: 'avgVoltage_H2',
            headerName: 'AvgVoltage_H2',
            filter: 'agSetColumnFilter'
          },
          {
            field: 'avgCurrent_H2',
            headerName: 'AvgCurrent_H2',
            filter: 'agSetColumnFilter'
          },
          {
            field: 'upTime_H2',
            headerName: 'UpTime_H2',
            filter: 'agSetColumnFilter'
          },
          {
            field: 'efficiency_H2',
            headerName: 'Efficiency_H2',
            filter: 'agSetColumnFilter'
          },
          {
            field: 'powerH2_KWh',
            headerName: 'PowerH2_KWh',
            filter: 'agSetColumnFilter'
          },
          {
            field: 'totalPower_KWh',
            headerName: 'TotalPower_KWh',
            filter: 'agSetColumnFilter'
          },
          {
            field: 'firstWeldClock_H1',
            headerName: 'FirstWeldClock_H1',
            filter: 'agSetColumnFilter'
          },
          {
            field: 'lastWeldClock_H1',
            headerName: 'LastWeldClock_H1',
            filter: 'agSetColumnFilter'
          },
          {
            field: 'firstWeldClock_H2',
            headerName: 'FirstWeldClock_H2',
            filter: 'agSetColumnFilter'
          },
          {
            field: 'lastWeldClock_H2',
            headerName: 'LastWeldClock_H2',
            filter: 'agSetColumnFilter'
          }
        ]

        break;
    }
  }

  getMachines() {
    this.machineService
      .getForCombo()
      .subscribe((data: any) => this.machines = data)
  }

  getShifts() {
    this.listItemService
      .getForCombo<[]>('10')
      .subscribe(data => this.shifts = data)
  }

  getReport() {
    const searchModel = this.form.value

    if (this.type == 1) {
      this.reportService
        .getDataLoggerReport(searchModel)
        .subscribe((data: []) => {
          this.records = data
        })
    } else {
      this.reportService
        .getWeldingTimeReport(searchModel)
        .subscribe((data: []) => {
          this.records = data
        })
    }
  }
}