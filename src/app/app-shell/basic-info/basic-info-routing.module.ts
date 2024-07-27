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

      { path: 'daily-record-report', component: DailyRecordReportComponent },
      { path: 'wire-type-consumption-report', component: WireTypeConsumptionReportComponent },
      { path: 'activity-report', component: ActivityReportComponent },
      { path: 'by-part-report', component: ByPartReportComponent },
      { path: 'project-report', component: ProjectReportComponent },
      { path: 'personnel-report', component: PersonnelReportComponent },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BasicInfoRoutingModule { }
