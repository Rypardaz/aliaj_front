import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ComboBase } from 'src/app/app-shell/framework-components/combo-base';
import { UserService } from '../../services/user.service';
import { NotificationService } from 'src/app/app-shell/framework-services/notification.service';
import { LocalStorageService } from 'src/app/app-shell/framework-services/local.storage.service';
import { FeatureService } from '../../services/feature.service';
import { BreadcrumbService } from 'src/app/app-shell/framework-services/breadcrumb.service';
import {
  USER_CLASSIFICATION_LEVEL_ID_NAME,
  USER_ORGANIZATION_CHART_ID_NAME,
} from 'src/app/app-shell/framework-services/configuration';
import { UserOperationModel } from './userOperationModel';
import * as moment from 'jalali-moment';
import { CompanyService } from '../../services/company.service';
import { OrganizationChartService } from '../../services/organization-chart.service';
import { JsTreeComponent } from 'src/app/app-shell/framework-components/js-tree-component/js-tree.component';
import { ModalComponent } from 'src/app/app-shell/framework-components/modal/modal.component';
import { ModalConfig } from 'src/app/app-shell/framework-components/modal/modal.config';
import { classificationLevelError } from 'src/app/app-shell/framework-components/app-messages';
import { AgGridBaseComponent } from 'src/app/app-shell/framework-components/ag-grid-base/ag-grid-base.component';
import { SettingService } from 'src/app/app-shell/framework-services/setting.service';
import { Router } from '@angular/router';
import { OperationLogService } from '../../services/operation-log.service';
declare var $: any;

@Component({
  selector: 'app-user-operation-log',
  templateUrl: './user-operation-log.component.html',
})
export class UserOperationLogComponent extends AgGridBaseComponent {
  userList: ComboBase[] = [];
  userLogList: UserOperationModel[] = [];
  form: FormGroup;
  title: string
  companies: [];

  modalConfig = new ModalConfig();

  @ViewChild('organizationChartModal')
  private organizationChartModal: ModalComponent;
  @ViewChild('jsTree') private jsTreeComponent: JsTreeComponent;

  constructor(
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly userService: UserService,
    private readonly companyService: CompanyService,
    private readonly featureService: FeatureService,
    private readonly operationLogService: OperationLogService,
    private readonly organizationChartService: OrganizationChartService,
    private readonly notificationService: NotificationService,
    private readonly breadcrumbService: BreadcrumbService) {
    super()

    this.form = this.fb.group({
      guid: [''],
      userGuid: [''],
      startDatePer: [this.getToday()],
      endDatePer: [this.getToday()],
      clientIpAddress: [''],
      companyGuid: [''],
      organizationChartTitle: [''],
      organizationChartGuid: [''],
    });
  }

  initForm() {
    this.form.patchValue({
      guid: '',
      userGuid: '',
      startDatePer: this.getToday(),
      endDatePer: this.getToday(),
      clientIpAddress: '',
      companyGuid: '',
      organizationChartTitle: '',
      organizationChartGuid: '',
    });
  }


  override ngOnInit() {
    super.ngOnInit()
    this.getClassificationLevel();
    this.initForm();
    this.getLog()

    this.gridOptions.columnDefs = [
      {
        field: 'fullname',
        headerName: 'نام کاربر',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'username',
        headerName: 'نام کاربری',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'companyTitle',
        headerName: 'شرکت',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'organizationChartTitle',
        headerName: 'واحدسازمانی',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'documentTypeTitle',
        headerName: 'منبع تغییر',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'logCommandTitle',
        headerName: 'نوع عملیات',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'clientIpAddress',
        headerName: 'IP Address',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'url',
        headerName: 'URL',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'created',
        headerName: 'تاریخ',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'message',
        headerName: 'پیغام',
        filter: 'agSetColumnFilter'
      }
    ]
  }

  getToday() {
    let today: any = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;
    return moment(today).locale('fa').format('YYYY/MM/DD');
  }

  getCompanies() {
    this.companyService.getForCombo().subscribe({
      next: (data: any) => (this.companies = data),
      complete: () => this.getUsers(),
    });
  }

  onModalClose() {
    $('#tree').jstree('destroy');
  }

  selected(node) {
    $('#organizationTitle').val(node.title);
    this.form.get('organizationChartGuid').setValue(node.guid);
    this.form.get('organizationChartTitle').setValue(node.title);
    this.organizationChartModal.close();
  }

  openOrganizationChartModal() {
    const companyGuid = this.form.get('companyGuid').value;
    if (!companyGuid) {
      this.notificationService.error('لطفا ابتدا شرکت را انتخاب نمایید.');
      return;
    }

    this.modalConfig.size = 'large';
    this.modalConfig.modalTitle = `انتخاب واحد سازمانی`;
    this.modalConfig.titleClassName = 'text-primary';
    this.modalConfig.hideCloseButton = false;
    this.modalConfig.hideSubmitButton = true;
    this.modalConfig.dualSave = false;

    const searchModel = {
      rootGuid: companyGuid,
    };

    this.organizationChartService.getForTree(searchModel).subscribe((data) => {
      this.companyService.getForEdit(companyGuid).subscribe((item: any) => {
        data.push({
          id: item.id,
          guid: companyGuid,
          title: item.title,
          parentId: '#',
        });

        this.organizationChartModal.open();

        this.jsTreeComponent.drawTree(data);
      });
    });
  }

  getUsers() {
    this.userService
      .getForCombo(
        this.localStorageService.getItem(USER_ORGANIZATION_CHART_ID_NAME)
      )
      .subscribe({
        next: (data: ComboBase[]) => {
          this.userList = data;
        },
      });
  }

  getClassificationLevel() {
    const userClassificationLevelGuid = this.localStorageService.getItem(
      USER_CLASSIFICATION_LEVEL_ID_NAME
    );
    const searchModel = {
      featureTitle: 'SystemManagement_User',
      userClassificationLevelGuid,
    };

    this.featureService
      .getClassificationLevelByTitle(searchModel)
      .subscribe((result) => {
        if (!result) {
          this.notificationService.error(classificationLevelError);
          this.router.navigateByUrl('/dashboard');
          return;
        }
        this.getCompanies();
        this.title = 'گزارش عملیات کاربران';
        this.breadcrumbService.setTitle(this.title);
        this.breadcrumbService.setClassificationLevel(result.title);
      });
  }

  getLog() {
    this.operationLogService
      .getOperationLog(this.form.value)
      .subscribe((data: UserOperationModel[]) => {
        this.userLogList = data;
      });
  }
}
