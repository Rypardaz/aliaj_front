import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { BasicInfoComponent } from './basic-info.component'
import { PartGroupComponent } from './part-group/part-group.component'
import { PartComponent } from './part/part.component'
import { TaskMasterComponent } from './task-master/task-master.component'
import { PersonnelComponent } from './personnel/personnel.component'
import { SalonComponent } from './salon/salon.component'
import { WireTypeComponent } from './wire-type/wire-type.component'
import { GasTypeComponent } from './gas-type/gas-type.component'
import { PowderTypeComponent } from './powder-type/powder-type.component'
import { ActivityComponent } from './activity/activity.component'
import { MachineComponent } from './machine/machine.component'
import { ProjectComponent } from './project/project.component'
import { ProjectOpsComponent } from './project/project-ops/project-ops.component'
import { DailyRecordComponent } from './daily-record/daily-record.component'
import { DailyRecordOpsComponent } from './daily-record/daily-record-ops/daily-record-ops.component'
import { GasTypeGroupComponent } from './gas-type-group/gas-type-group.component'
import { WireTypeGroupComponent } from './wire-type-group/wire-type-group.component'
import { PowderTypeGroupComponent } from './powder-type-group/powder-type-group.component'
import { WireScrewComponent } from './wire-screw/wire-screw.component'
import { ProjectTypeComponent } from './project-type/project-type.component'
import { WorkCalendarComponent } from './work-calendar/work-calendar.component'
import { DailyRecordReportComponent } from './reports/daily-record-report/daily-record-report.component'
import { WireTypeConsumptionReportComponent } from './reports/wire-type-consumption-report/wire-type-consumption-report.component'
import { ActivityReportComponent } from './reports/activity-report/activity-report.component'
import { ByPartReportComponent } from './reports/by-part-report/by-part-report.component'
import { ProjectReportComponent } from './reports/project-report/project-report.component'
import { PersonnelReportComponent } from './reports/personnel-report/personnel-report.component'
import { WireConsumptionChartReportComponent } from './reports/wire-consumption-chart-report/wire-consumption-chart-report.component'
import { RandemanChartReportComponent } from './reports/randeman-chart-report/randeman-chart-report.component'
import { WireConsumptionToStandardChartReportComponent } from './reports/wire-consumption-to-standaard-chart-report/wire-consumption-to-standaard-chart-report.component'
import { ProjectChartReportComponent } from './reports/project-chart-report/project-chart-report.component'
import { DataLoggerReportComponent } from './reports/data-logger-report/data-logger-report.component'
import { MachineReportComponent } from './reports/machine-report/machine-report.component'
import { WeldingTimeChartReportComponent } from './reports/welding-time-chart-report/welding-time-chart-report.component'
import { ActivityChartReportComponent } from './reports/activity-chart-report/activity-chart-report.component'
import { TicketComponent } from './ticket/ticket.component'
import { InboxComponent } from './ticket/inbox/inbox.component'
import { FinalCardProjectReportComponent } from './reports/final-card-project-report/final-card-project-report.component'
import { DailyRecordListReportComponent } from './reports/daily-record-list-report/daily-record-list-report.component'
import { BachreportondateComponent } from './reports/bachreportondate/bachreportondate.component'
import { DailyrecordlistproductunitsComponent } from './reports/dailyrecordlistproductunits/dailyrecordlistproductunits.component'

const routes: Routes = [
  {
    path: '',
    component: BasicInfoComponent,
    children: [
      { path: 'partGroup', component: PartGroupComponent },
      { path: 'part', component: PartComponent },
      { path: 'taskMaster', component: TaskMasterComponent },
      { path: 'personnel', component: PersonnelComponent },
      { path: 'salon', component: SalonComponent },
      { path: 'wireScrew', component: WireScrewComponent },
      { path: 'wireType', component: WireTypeComponent },
      { path: 'wireTypeGroup', component: WireTypeGroupComponent },
      { path: 'gasType', component: GasTypeComponent },
      { path: 'gasTypeGroup', component: GasTypeGroupComponent },
      { path: 'powderType', component: PowderTypeComponent },
      { path: 'powderTypeGroup', component: PowderTypeGroupComponent },
      { path: 'activity', component: ActivityComponent },
      { path: 'machine', component: MachineComponent },
      { path: 'projectType', component: ProjectTypeComponent },
      { path: 'work-calendar', component: WorkCalendarComponent },

      { path: 'project', component: ProjectComponent },
      { path: 'project-ops', component: ProjectOpsComponent },
      { path: 'project-ops/:guid', component: ProjectOpsComponent },

      { path: 'daily-record/:guid', component: DailyRecordComponent },
      { path: 'daily-record-ops', component: DailyRecordOpsComponent },
      { path: 'daily-record-ops/:guid', component: DailyRecordOpsComponent },

      { path: 'daily-record-report/:type', component: DailyRecordReportComponent },
      { path: 'weekly-record-report/:type', component: DailyRecordReportComponent },
      { path: 'monthly-record-report/:type', component: DailyRecordReportComponent },

      { path: 'daily-wire-type-consumption-report/:type', component: WireTypeConsumptionReportComponent },
      { path: 'weekly-wire-type-consumption-report/:type', component: WireTypeConsumptionReportComponent },
      { path: 'monthly-wire-type-consumption-report/:type', component: WireTypeConsumptionReportComponent },

      { path: 'machine-report', component: MachineReportComponent },
      { path: 'final-card-project-report', component: FinalCardProjectReportComponent },
      { path: 'daily-record-list-report', component: DailyRecordListReportComponent },
      { path: 'bachreportondate', component: BachreportondateComponent },
      { path: 'dailyrecordlistproductunits', component: DailyrecordlistproductunitsComponent },

      // { path: 'daily-machine-report/:type', component: MachineReportComponent },
      // { path: 'weekly-machine-report/:type', component: MachineReportComponent },
      // { path: 'monthly-machine-report/:type', component: MachineReportComponent },

      { path: 'activity-report', component: ActivityReportComponent },
      { path: 'by-part-report', component: ByPartReportComponent },
      { path: 'project-report', component: ProjectReportComponent },
      { path: 'personnel-report', component: PersonnelReportComponent },

      { path: 'daily-wire-consumption-chart/:type', component: WireConsumptionChartReportComponent },
      { path: 'weekly-wire-consumption-chart/:type', component: WireConsumptionChartReportComponent },
      { path: 'monthly-wire-consumption-chart/:type', component: WireConsumptionChartReportComponent },
      { path: 'party-wire-consumption-chart/:type', component: WireConsumptionChartReportComponent },
      { path: 'personnel-wire-consumption-chart/:type', component: WireConsumptionChartReportComponent },
      { path: 'machine-wire-consumption-chart/:type', component: WireConsumptionChartReportComponent },

      { path: 'welding-time-chart/:type', component: WeldingTimeChartReportComponent },

      { path: 'weekly-randeman-chart/:type', component: RandemanChartReportComponent },
      { path: 'monthly-randeman-chart/:type', component: RandemanChartReportComponent },

      { path: 'weekly-wire-consumption-to-standard-chart/:type', component: WireConsumptionToStandardChartReportComponent },
      { path: 'monthly-wire-consumption-to-standard-chart/:type', component: WireConsumptionToStandardChartReportComponent },

      { path: 'daily-activity-chart/:type', component: ActivityChartReportComponent },
      { path: 'weekly-activity-chart/:type', component: ActivityChartReportComponent },
      { path: 'monthly-activity-chart/:type', component: ActivityChartReportComponent },

      { path: 'project-chart', component: ProjectChartReportComponent },

      { path: 'daily-data-logger-report/:type', component: DataLoggerReportComponent },
      { path: 'monthly-data-logger-report/:type', component: DataLoggerReportComponent },
      { path: 'value-data-logger-report/:type', component: DataLoggerReportComponent },

      { path: 'ticket', component: TicketComponent },
      { path: 'inbox', component: InboxComponent },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BasicInfoRoutingModule { }
