import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserManagementComponent } from './user-management.component';
import { AgGridModule } from 'ag-grid-angular';
import { PhoenixFrameworkModule } from '../framework-components/framework.module';
import { UserManagementRoutingModule } from './user-management-routing.module';
import { UserGroupListComponent } from './user-group/user-group-list/user-group-list.component';
import { UserGroupOpsComponent } from './user-group/user-group-ops/user-group-ops.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { UserOpsComponent } from './user/user-ops/user-ops.component';
import { CompanyComponent } from './company/company.component';
import { OrganizationChartComponent } from './organization-chart/organization-chart.component';
import { PasswordStrengthMeterModule } from 'angular-password-strength-meter';
import { DEFAULT_PSM_OPTIONS } from 'angular-password-strength-meter/zxcvbn';
import { ClassificationLevelComponent } from './classification-level/classification-level.component';
import { UserLogComponent } from './user/user-log/user-log.component';
import { UserSessionSuccessCellRendererComponent } from './user/user-log/user-session-success-cell-renderer.component';
import { UserOperationLogComponent } from './user/user-operation-log/user-operation-log.component';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    UserManagementComponent,

    UserGroupListComponent,
    UserGroupOpsComponent,

    UserListComponent,
    UserOpsComponent,
    UserLogComponent,
    UserOperationLogComponent,
    ClassificationLevelComponent,
    UserSessionSuccessCellRendererComponent,

    CompanyComponent,
    OrganizationChartComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    PhoenixFrameworkModule,
    NgSelectModule,
    AgGridModule,
    UserManagementRoutingModule,
    PasswordStrengthMeterModule.forRoot(DEFAULT_PSM_OPTIONS)
  ]
})
export class UserManagementModule { }
