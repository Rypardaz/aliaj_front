import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { operationSuccessful } from '../../framework-components/app-messages';
import { NotificationService } from '../../framework-services/notification.service';
import * as _ from 'lodash';
import { SwalService } from '../../framework-services/swal.service';
import { createGuid, formGroupToFormData } from '../../framework-components/constants';
import { JsTreeComponent } from '../../framework-components/js-tree-component/js-tree.component';
import { ModalComponent } from '../../framework-components/modal/modal.component';
import { CompanyService } from '../services/company.service';
import { OrganizationChartService } from '../services/organization-chart.service';
import { ModalConfig } from '../../framework-components/modal/modal.config';
import { BreadcrumbService } from '../../framework-services/breadcrumb.service';
declare var $: any;

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
})

export class CompanyComponent implements OnInit {
  records = [];
  organizationChart = [];
  selectedCompanyGuid = 0;
  holdings = [];

  searchModel = {
    term: '',
    isLocked: false,
  }

  companyModalConfig = new ModalConfig()
  holdingChartModalConfig = new ModalConfig()
  organizationChartModalConfig = new ModalConfig()

  @ViewChild('companyModal') private companyModalComponent: ModalComponent;
  @ViewChild('holdingChartModal') private holdingChartModalComponent: ModalComponent;
  @ViewChild('organizationChartModal') private organizationChartModal: ModalComponent;
  @ViewChild('jsTree') private jsTreeComponent: JsTreeComponent;

  companyForm = new FormGroup({
    guid: new FormControl(),
    title: new FormControl(),
    parentGuid: new FormControl(0),
    parentTitle: new FormControl(),
    address: new FormControl(),
    logo: new FormControl(),
    description: new FormControl(),
    IsActive: new FormControl(),
    IsDelete: new FormControl()
  })

  constructor(
    private readonly companyService: CompanyService,
    private readonly router: Router,
    private readonly notificationService: NotificationService,
    private readonly organizationChartService: OrganizationChartService,
    private readonly swalService: SwalService,
    breadcrumbService: BreadcrumbService) { }

  ngOnInit(): void {
    this.getRecords();
    this.companyModalConfig.id = 'companyModal'
    this.holdingChartModalConfig.id = 'holdingModal'
    this.organizationChartModalConfig.id = 'organizationChartModal'
  }

  openCompanyModal(company = null) {
    if (company)
      this.companyForm.patchValue(company);
    else {
      // this.companyForm.reset()
    }

    this.companyModalConfig.size = 'large'
    this.companyModalConfig.modalTitle = 'فرم اطلاعات سازمان، موسسه یا شرکت'
    this.companyModalConfig.titleClassName = 'text-dark'
    this.companyModalComponent.open()
  }

  openCompanyChartModal(company = null) {
    this.holdings = this.records.filter(x => !x.parentId)

    if (this.holdings.length == 1) {
      this.navigateToChart('holding', this.holdings[0].guid)
    } else {
      this.holdingChartModalConfig.modalTitle = 'انتخاب شرکت برای نمایش چارت سازمانی'
      this.holdingChartModalConfig.titleClassName = 'text-dark'
      this.holdingChartModalComponent.open()
    }
  }

  getRecords() {
    this.companyService
      .getList()
      .subscribe((data: any) => {
        this.records = data
      })
  }

  openOrganizationChartModal(item) {
    this.organizationChartModalConfig.hideSubmitButton = true
    this.organizationChartModalConfig.modalTitle = `تعریف چارت سازمانی ${item.title}`
    this.organizationChartModalConfig.titleClassName = 'text-success'
    this.selectedCompanyGuid = item.guid

    const searchModel = {
      rootGuid: item.guid
    }

    this.organizationChartService
      .getForTree(searchModel)
      .subscribe(data => {
        this.organizationChart = data;
        this.organizationChart.push({
          id: item.id,
          guid: item.guid,
          title: item.title,
          parentId: '#'
        });

        this.organizationChartModalConfig.size = 'large'
        this.organizationChartModal.open()
        this.jsTreeComponent.drawTree(data);
      });
  }

  destroyTree() {
    this.jsTreeComponent.destroy()
  }

  rename(command) {
    command.companyGuid = this.selectedCompanyGuid
    this.organizationChartService
      .edit(command)
      .subscribe((_: any) => {
        this.notificationService.succeded()
      })
  }

  move(command) {
    this.organizationChartService
      .changeParent(command)
      .subscribe((_: any) => {
        this.notificationService.succeded()
      })
  }

  delete(id) {
    this.organizationChartService
      .delete(id)
      .subscribe((_: any) => {
        this.notificationService.succeded()
      })
  }

  setFile(event: any) {
    const file = (event.target as HTMLInputElement).files[0]
    if (file.size > 5000000) {
      this.notificationService.error('سایز لوگو غیر مجاز است')
      return;
    }

    this.companyForm.get('logo').setValue(file)
    this.companyForm.get('logo').updateValueAndValidity()
    $('#logo').attr('src', window.URL.createObjectURL(file))
  }

  submit() {
    const command = this.companyForm.getRawValue()
    const formData = formGroupToFormData(this.companyForm)

    if (command.guid) {
      this.companyService
        .editWithFile(formData)
        .subscribe(data => {
          this.getRecords();
          this.companyModalComponent.close()
        });
    } else {
      this.companyService
        .createWithFile(formData)
        .subscribe(id => {
          this.getRecords();
          this.companyModalComponent.close()
        });
    }
  }

  askForDelete(id) {
    this.swalService
      .fireSwal('آیا از حذف این ردیف اطمینان دارید؟')
      .then((t) => {
        if (t.value === true) {
          this.companyService
            .delete(id)
            .subscribe(_ => this.getRecords())
        } else {
          this.swalService.dismissSwal(t)
        }
      });
  }

  navigateToChart(type, guid) {
    this.router.navigate(['/user-management/organization-chart', type, guid])
  }

  handleCreateEditOps(id) {
    this.notificationService.succeded(operationSuccessful)
  }
}