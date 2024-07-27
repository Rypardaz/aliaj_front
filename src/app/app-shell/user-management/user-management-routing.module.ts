import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { UserGroupListComponent } from "./user-group/user-group-list/user-group-list.component";
import { UserGroupOpsComponent } from "./user-group/user-group-ops/user-group-ops.component";
import { UserListComponent } from "./user/user-list/user-list.component";
import { UserOpsComponent } from "./user/user-ops/user-ops.component";
import { CompanyComponent } from "./company/company.component";
import { OrganizationChartComponent } from "./organization-chart/organization-chart.component";
import { ClassificationLevelComponent } from "./classification-level/classification-level.component";
import { UserOperationLogComponent } from "./user/user-operation-log/user-operation-log.component";
import { UserLogComponent } from "./user/user-log/user-log.component";

const routes: Routes = [
    { path: 'user-group/list', component: UserGroupListComponent },
    { path: 'user-group/create', component: UserGroupOpsComponent },
    { path: 'user-group/edit/:guid', component: UserGroupOpsComponent },

    { path: 'user/list', component: UserListComponent },
    { path: 'user/create', component: UserOpsComponent },
    { path: 'user/edit/:guid', component: UserOpsComponent },
    { path: 'user-log/list', component: UserLogComponent },
    { path: 'user-operation-log/list', component: UserOperationLogComponent },

    { path: 'classification-level', component: ClassificationLevelComponent },
    { path: 'company', component: CompanyComponent },
    { path: 'organization-chart/:type/:rootGuid', component: OrganizationChartComponent },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserManagementRoutingModule { }