import { AfterViewChecked, Component, OnInit, ViewChild } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router, ParamMap } from '@angular/router'
import { UserGroupService } from '../../services/user-group.service'
import { UserService } from '../../services/user.service'
import { UserGroup } from '../../types/user-group'
import { NotificationService } from 'src/app/app-shell/framework-services/notification.service'
import { operationSuccessful } from 'src/app/app-shell/framework-components/app-messages'
import { CompanyService } from '../../services/company.service'
import { ModalConfig } from 'src/app/app-shell/framework-components/modal/modal.config'
import { OrganizationChartService } from '../../services/organization-chart.service'
import { JsTreeComponent } from 'src/app/app-shell/framework-components/js-tree-component/js-tree.component'
import { ModalComponent } from 'src/app/app-shell/framework-components/modal/modal.component'
import { ClassificationLevelService } from '../../services/classification-level.service'
import { ComboBase } from 'src/app/app-shell/framework-components/combo-base'
import { SalonService } from 'src/app/app-shell/basic-info/salon/salon.service'
declare var $: any

@Component({
  selector: 'app-user-ops',
  templateUrl: './user-ops.component.html'
})
export class UserOpsComponent implements OnInit, AfterViewChecked {

  title = "ایجاد کاربر"
  guid: string
  userGroups: ComboBase[] = []
  salons = []
  passwordStrength = 0

  classificationLevels: ComboBase[];

  modalConfig = new ModalConfig()

  @ViewChild('jsTree') private jsTreeComponent: JsTreeComponent
  @ViewChild('organizationChartModal') private organizationChartModal: ModalComponent

  userOpsFrm = new FormGroup({
    guid: new FormControl(),
    roleGuids: new FormControl(),
    salonIds: new FormControl(),
    // companyGuid: new FormControl(),
    // organizationChartGuid: new FormControl(),
    // organizationChartTitle: new FormControl(),
    username: new FormControl('', Validators.required),
    fullname: new FormControl('', Validators.required),
    engFullname: new FormControl('', Validators.required),
    password: new FormControl(),
    rePassword: new FormControl(),
    mobile: new FormControl('', Validators.required),
    email: new FormControl(''),
    companies: new FormControl(),
    employeeCode: new FormControl(),
    // classificationLevelGuid: new FormControl()
  })

  constructor(
    private readonly userService: UserService,
    private readonly userGroupService: UserGroupService,
    private readonly route: ActivatedRoute,
    private readonly notificationService: NotificationService,
    private readonly companyService: CompanyService,
    private readonly router: Router,
    private readonly salonService: SalonService,
    private readonly organizationChartService: OrganizationChartService,
    private readonly classificationLevelService: ClassificationLevelService) {
  }

  get password() {
    return this.userOpsFrm.get('password').value
  }

  ngAfterViewChecked(): void {
    $("select").trigger("change")
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const guid = params.get('guid')
      if (guid != null) {
        this.guid = guid
        this.getUserDetails()
      }
    })

    this.userGroupService
      .getForCombo<ComboBase[]>()
      .subscribe({
        next: data => this.userGroups = data,
        // complete: () => this.getCompanies()
      })

    this.salonService
      .getForCombo()
      .subscribe((data: []) => this.salons = data)
  }

  // getCompanies() {
  //   this.companyService
  //     .getForCombo()
  //     .subscribe(
  //       {
  //         next: (data: any) => this.companies = data,
  //         complete: () => this.getClassificationLevels()
  //       }
  //     )
  // }

  getClassificationLevels() {
    this.classificationLevelService
      .getForCombo<ComboBase[]>()
      .subscribe(data => this.classificationLevels = data)
  }

  getUserDetails() {
    this.userService
      .getBy(this.guid)
      .subscribe(data => {
        this.userOpsFrm.patchValue(data)
        $('select').trigger('change')
      })
  }

  onBtnCancelClick() {
    this.router.navigateByUrl('/user-management/user/list')
  }

  submit(action) {
    const command = this.userOpsFrm.value

    if (command.password && this.passwordStrength < 4) {
      this.notificationService.error('کلمه عبور ضعیف است. کلمه عبور باید شامل حروف، اعداد و کاراکتر باشد و حداقل طول آن 6 کاراکتر است.')
      return
    }

    if (command.password != command.rePassword) {
      this.notificationService.error('کلمه رمز با تکرار آن برابر نیست.')
      return
    }

    if (this.guid) {
      this.userOpsFrm.get('guid').setValue(this.guid)
      this.userService
        .edit(command)
        .subscribe(() => {
          this.handleCreateEditOps(action, this.guid)
        })
    } else {
      this.userService
        .create(command)
        .subscribe(id => {
          this.handleCreateEditOps(action, id)
        })
    }
  }

  handleCreateEditOps(action, id) {
    if (action == "new") {
      this.userOpsFrm.reset()
      this.title = 'ایجاد کاربر جدید'
      this.guid = ''
      document.getElementById("code").focus()
    }
    else if (action == "exit") {
      this.router.navigateByUrl('/user-management/user/list')
    }
    else {
      this.title = 'ویرایش کاربر'
      this.router.navigateByUrl(`/user-management/user/edit/${id}`)
    }

    this.notificationService.succeded(operationSuccessful)
  }

  openOrganizationChartModal() {
    const companyGuid = this.userOpsFrm.get('companyGuid').value
    if (!companyGuid) {
      this.notificationService.error('لطفا ابتدا شرکت را انتخاب نمایید.')
      return
    }

    this.modalConfig.size = 'large'
    this.modalConfig.modalTitle = `انتخاب واحد سازمانی`;
    this.modalConfig.titleClassName = 'text-primary';
    this.modalConfig.hideCloseButton = false;
    this.modalConfig.hideSubmitButton = true
    this.modalConfig.dualSave = false

    const searchModel = {
      rootGuid: companyGuid
    };

    this.organizationChartService
      .getForTree(searchModel)
      .subscribe(data => {
        this.companyService
          .getForEdit(companyGuid)
          .subscribe((item: any) => {
            data.push({
              id: item.id,
              guid: companyGuid,
              title: item.title,
              parentId: '#'
            });

            this.organizationChartModal.open()

            this.jsTreeComponent.drawTree(data);
          });
      });
  }

  onModalClose() {
    $('#tree').jstree('destroy');
  }

  selected(node) {
    $('#organizationTitle').val(node.title);
    // this.userOpsFrm.get('organizationChartGuid').setValue(node.guid)
    // this.userOpsFrm.get('organizationChartTitle').setValue(node.title)
    this.organizationChartModal.close();
  }

  strengthChange(strength) {
    this.passwordStrength = strength
  }
}
