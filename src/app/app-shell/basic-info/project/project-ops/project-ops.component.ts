import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskMasterService } from '../../task-master/task-master.service';
import { ComboBase } from 'src/app/app-shell/framework-components/combo-base';
import { SalonService } from '../../salon/salon.service';
import { PartService } from '../../part/part.service';
import { GasTypeService } from '../../gas-type/gas-type.service';
import { WireTypeService } from '../../wire-type/wire-type.service';
import { PowderTypeService } from '../../powder-type/powder-type.service';
import { createGuid } from 'src/app/app-shell/framework-components/constants';
import { BreadcrumbService } from 'src/app/app-shell/framework-services/breadcrumb.service';
import { ProjectService } from '../project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/app-shell/framework-services/notification.service';
import { ListItemService } from '../../list-item/list-item.service';
import { ProjectTypeService } from '../../project-type/project-type.service';
import { WireScrewService } from '../../wire-screw/wire-screw.service';
import { ModalConfig } from 'src/app/app-shell/framework-components/modal/modal.config';
import { ModalComponent } from 'src/app/app-shell/framework-components/modal/modal.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-project-ops',
  templateUrl: './project-ops.component.html'
})
export class ProjectOpsComponent implements OnInit {

  guid
  form: FormGroup
  details = []
  taskMasters = []
  salons = []
  projectTypes = []
  projectStatuses = []

  parts = []
  gasTypes = []
  wireTypes = []
  wireScrews = []
  powderTypes = []

  countToAdd = 0

  selectedSalon
  modalConfig = new ModalConfig()
  @ViewChild('addGroupDetailModal') private addGroupDetailModal: ModalComponent

  constructor(
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly activatedRoute: ActivatedRoute,
    private readonly taskMasterService: TaskMasterService,
    private readonly salonService: SalonService,
    private readonly partService: PartService,
    private readonly gasTypeService: GasTypeService,
    private readonly wireTypeSerivce: WireTypeService,
    private readonly powderTypeService: PowderTypeService,
    private readonly breadcrumbService: BreadcrumbService,
    private readonly projectService: ProjectService,
    private readonly notificationService: NotificationService,
    private readonly listItemService: ListItemService,
    private readonly projectTypeService: ProjectTypeService,
    private readonly wireScrewService: WireScrewService) {
    this.form = this.fb.group({
      guid: [''],
      code: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(20)
      ]],
      name: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(100)
      ]],
      taskMasterGuid: ['', [Validators.required]],
      salonGuid: ['', [Validators.required]],
      projectTypeGuid: ['', [Validators.required]],
      deliveryDate: ['', [Validators.required]],
      isActive: ['BAA012D7-6EC5-437F-95D8-160131D8BD71'],
      description: ['']
    })
  }

  ngOnInit(): void {
    this.guid = this.activatedRoute.snapshot.paramMap.get('guid')
    this.modalConfig.modalTitle = 'افزودن ردیف به صورت گروهی'
    this.modalConfig.dualSave = false

    this.taskMasterService
      .getForCombo<ComboBase[]>()
      .subscribe(data => this.taskMasters = data)

    this.salonService
      .getForCombo<[]>()
      .subscribe(salons => {
        this.salons = salons

        this.wireScrewService
          .getForCombo<[]>()
          .subscribe(wireScrews => {
            this.wireScrews = wireScrews

            if (this.guid)
              this.getForEdit()

            this.form
              .get('salonGuid')
              .valueChanges
              .subscribe(salonGuid => {
                this.selectedSalon = this.salons.find(x => x.guid == salonGuid)

                this.projectTypeService
                  .getForCombo<ComboBase[]>(salonGuid)
                  .subscribe(data => {
                    this.projectTypes = data
                  })
              })
          })
      })

    this.partService
      .getForCombo<ComboBase[]>()
      .subscribe(data => this.parts = data)

    this.gasTypeService
      .getForCombo<ComboBase[]>()
      .subscribe(data => this.gasTypes = data)

    this.wireTypeSerivce
      .getForCombo<ComboBase[]>()
      .subscribe(data => this.wireTypes = data)

    this.powderTypeService
      .getForCombo<ComboBase[]>()
      .subscribe(data => this.powderTypes = data)

    this.listItemService
      .getForCombo<ComboBase[]>('11')
      .subscribe(data => this.projectStatuses = data)

    this.breadcrumbService.reset()
    this.breadcrumbService.setTitle('فرم پروژه')
  }

  getForEdit() {
    this.projectService
      .getForEdit(this.guid)
      .subscribe((data: any) => {
        this.selectedSalon = this.salons.find(x => x.guid == data.salonGuid)
        this.form.patchValue(data)
        this.details = data.details

        this.details.forEach(detail => {
          detail.wireScrews = this.wireScrews.filter(x => x.wireTypeGuid == detail.wireTypeGuid)
        })
      })
  }

  addDetail() {
    const record = {
      guid: createGuid()
    }

    this.details.push(record)
  }

  openAddGroupDetailModal() {
    if (!this.details.length) {
      this.notificationService.error('لطفا ابتدا یک ردیف را برای استفاده به عنوان نمونه اضافه کنید.')
      return
    }

    this.addGroupDetailModal.open()
  }

  addGroupDetail() {
    const firstDetail = this.details[0]
    const countToAdd = parseInt(this.countToAdd.toString())

    for (let index = 1; index <= countToAdd; index++) {
      const detail = JSON.parse(JSON.stringify(firstDetail))
      detail.id = 0
      detail.guid = createGuid()
      detail.partCode = parseInt(firstDetail.partCode) + index

      this.details.push(detail)
    }

    this.addGroupDetailModal.close()
  }

  getActiveDetails() {
    return this.details.filter(x => !x.isDeleted)
  }

  removeDetail(guid) {
    const detail = this.details.find(x => x.guid == guid)
    if (detail.id) {
      detail.isDeleted = true
    } else {
      const index = this.details.findIndex(x => x.guid == guid)
      this.details.splice(index, 1)
    }
  }

  submit(action) {
    const command = this.form.getRawValue()
    command.details = this.details

    if (!this.details.length) {
      this.notificationService.error('امکان ذخیره رکورد بدون ردیف وجود ندارد.')
      return
    }

    const errors = []
    this.details.forEach(detail => {
      if (this.details.find(x => x.partCode == detail.partCode && x.guid != detail.guid)) {
        errors.push(detail.partCode)
        return
      }
    })

    if (errors.length) {
      this.notificationService.error(`کد بعضی از قطعات تکراری وارد شده است.`)
      return
    }

    if (command.guid) {
      this.projectService
        .edit(command)
        .subscribe(data => {
          this.handleSubmit()
        })
    } else {
      this.projectService
        .create(command)
        .subscribe(data => {
          this.handleSubmit()
        })
    }
  }

  handleSubmit() {
    this.navigateToList()
    this.notificationService.succeded()
  }

  navigateToList() {
    this.router.navigateByUrl('basic-info/project')
  }

  onWireTypeChange(guid) {
    const detail = this.details.find(x => x.guid == guid)
    detail.wireScrewGuid = null
    detail.wireScrews = this.wireScrews.filter(x => x.wireTypeGuid == detail.wireTypeGuid)
  }

  deleteSelected() {
    const guids = this.details.filter(x => x.checked).map(x => x.guid)
    if (!guids.length) {
      this.notificationService.error('هیج آیتمی انتخاب نشده است')
      return
    }

    guids.forEach(guid => this.removeDetail(guid))
  }
}