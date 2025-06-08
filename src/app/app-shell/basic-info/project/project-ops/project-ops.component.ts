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
  groupAddType = 0

  selectedSalon
  isReadonly = false
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
      replacementWireTypeGuids: [''],
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

                this.partService
                  .getForCombo<ComboBase[]>(salonGuid)
                  .subscribe(data => this.parts = data)

                this.projectTypeService
                  .getForCombo<ComboBase[]>(salonGuid)
                  .subscribe(data => {
                    this.projectTypes = data
                  })
              })
          })
      })

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
        this.isReadonly = this.projectStatuses.find(x => x.guid == data.isActive).code == 3

        this.details.forEach(detail => {
          detail.wireScrews = this.wireScrews.filter(x => x.wireTypeGuid == detail.wireTypeGuid)
        })
      })
  }

  detailsHasInvalidItem() {
    let filter = this.getActiveDetails().filter(x => x.partGuid && x.partCode)

    if (this.selectedSalon.hasGas)
      filter = filter.filter(x => x.gasTypeGuid)

    if (this.selectedSalon.hasPowder)
      filter = filter.filter(x => x.powderTypeGuid && x.wireThickness && x.wireConsumption)

    if (this.selectedSalon.hasWire)
      filter = filter.filter(x => x.wireTypeGuid)

    if (this.selectedSalon.hasWireScrew)
      filter = filter.filter(x => x.wireScrewGuid)

    const result = filter.length < this.getActiveDetails().length

    if (result)
      this.notificationService.error('لطفا ردیف های ناقص را کامل نمایید.')

    return result
  }

  addDetail() {
    if (!this.selectedSalon) {
      this.notificationService.error('لطفا ابتدا واحد کاری را مشخص کنید.')
      return
    }

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
    let pattern = this.details.find(x => x.checked)

    if (!pattern)
      pattern = this.details[0]

    let countToAdd = parseInt(this.countToAdd.toString())
    const split = pattern.partCode.split('.')

    let startIndex = parseInt(split[1]) + 1
    if (this.groupAddType) {
      startIndex = parseInt(split[0]) + 1
    }
    countToAdd += startIndex

    for (let index = startIndex; index < countToAdd; index++) {
      const detail = JSON.parse(JSON.stringify(pattern))
      detail.id = 0
      detail.checked = false
      detail.guid = createGuid()

      if (this.groupAddType)
        detail.partCode = index
      else
        detail.partCode = `${split[0]}.${index}`

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

    if (this.detailsHasInvalidItem()) return

    if (!this.details.length) {
      this.notificationService.error('امکان ذخیره رکورد بدون ردیف وجود ندارد.')
      return
    }

    if (command.guid) {
      this.projectService
        .edit(command)
        .subscribe(data => {
          this.handleSubmit(action, command.guid)
        })
    } else {
      this.projectService
        .create(command)
        .subscribe(guid => {
          this.handleSubmit(action, guid)
        })
    }
  }

  handleSubmit(action, guid) {
    this.notificationService.succeded()
    if (action == 1) {
      this.navigateToList()
    }
    else {
      if (this.guid) {
        this.getForEdit()
      } else {
        this.router.navigateByUrl(`/basic-info/project-ops/${guid}`)
      }
    }
  }

  navigateToList() {
    this.router.navigateByUrl('basic-info/project')
  }

  cloneDetail(guid) {
    const detail = JSON.parse(JSON.stringify(this.details.find(x => x.guid == guid)))
    detail.id = 0
    detail.guid = createGuid()
    detail.wireThickness = ''
    detail.wireConsumption = ''
    this.details.push(detail)
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