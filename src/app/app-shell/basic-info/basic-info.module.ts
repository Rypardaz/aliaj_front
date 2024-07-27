import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicInfoComponent } from './basic-info.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PhoenixFrameworkModule } from '../framework-components/framework.module';
import { BasicInfoRoutingModule } from './basic-info-routing.module';
import { DataTablesModule } from "angular-datatables";
import { PartGroupComponent } from './part-group/part-group.component';
import { PartComponent } from './part/part.component';
import { TaskMasterComponent } from './task-master/task-master.component';
import { SalonComponent } from './salon/salon.component';
import { PersonnelComponent } from './personnel/personnel.component';
import { GasTypeComponent } from './gas-type/gas-type.component';
import { PowderTypeComponent } from './powder-type/powder-type.component';
import { WireTypeComponent } from './wire-type/wire-type.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ActivityComponent } from './activity/activity.component';
import { MachineComponent } from './machine/machine.component';
import { ProjectComponent } from './project/project.component';
import { AgGridModule } from 'ag-grid-angular';
import { ProjectOpsComponent } from './project/project-ops/project-ops.component';
import { DailyRecordComponent } from './daily-record/daily-record.component';
import { DailyRecordOpsComponent } from './daily-record/daily-record-ops/daily-record-ops.component';
import { NgxMaskModule } from 'ngx-mask';
import { GasTypeGroupComponent } from './gas-type-group/gas-type-group.component';
import { PowderTypeGroupComponent } from './powder-type-group/powder-type-group.component';
import { WireTypeGroupComponent } from './wire-type-group/wire-type-group.component';
import { WireScrewComponent } from './wire-screw/wire-screw.component';
import { ProjectTypeComponent } from './project-type/project-type.component';
import { WorkCalendarComponent } from './work-calendar/work-calendar.component';
import { DailyRecordReportComponent } from './reports/daily-record-report/daily-record-report.component';
import { WireTypeConsumptionReportComponent } from './reports/wire-type-consumption-report/wire-type-consumption-report.component';
import { ActivityReportComponent } from './reports/activity-report/activity-report.component';
import { ByPartReportComponent } from './reports/by-part-report/by-part-report.component';
import { ProjectReportComponent } from './reports/project-report/project-report.component';
import { PersonnelReportComponent } from './reports/personnel-report/personnel-report.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BasicInfoRoutingModule,
    PhoenixFrameworkModule,
    DataTablesModule,
    NgSelectModule,
    AgGridModule,
    NgxMaskModule.forRoot()
  ],
  declarations: [
    BasicInfoComponent,
    PartGroupComponent,
    PartComponent,
    TaskMasterComponent,
    SalonComponent,
    PersonnelComponent,
    GasTypeComponent,
    GasTypeGroupComponent,
    PowderTypeComponent,
    PowderTypeGroupComponent,
    WireTypeComponent,
    WireTypeGroupComponent,
    ActivityComponent,
    MachineComponent,
    ProjectComponent,
    ProjectOpsComponent,
    DailyRecordComponent,
    DailyRecordOpsComponent,
    GasTypeGroupComponent,
    PowderTypeGroupComponent,
    WireTypeGroupComponent,
    WireScrewComponent,
    ProjectTypeComponent,
    WorkCalendarComponent,

    DailyRecordReportComponent,
    WireTypeConsumptionReportComponent,
    ActivityReportComponent,
    ByPartReportComponent,
    ProjectReportComponent,
    PersonnelReportComponent
  ],
})
export class BasicInfoModule { }
