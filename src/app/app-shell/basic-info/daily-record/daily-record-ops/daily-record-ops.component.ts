import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ComboBase } from 'src/app/app-shell/framework-components/combo-base';
import { SalonService } from '../../salon/salon.service';
import { GasTypeService } from '../../gas-type/gas-type.service';
import { activityTypes, createGuid } from 'src/app/app-shell/framework-components/constants';
import { BreadcrumbService } from 'src/app/app-shell/framework-services/breadcrumb.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/app-shell/framework-services/notification.service';
import { ListItemService } from '../../list-item/list-item.service';
import { DailyRecordService } from '../daily-record.service';
import { MachineService } from '../../machine/machine.service';
import { PersonnelService } from '../../personnel/personnel.service';
import { ProjectService } from '../../project/project.service';
import { ActivityService } from '../../activity/activity.service';
import { LocalStorageService } from 'src/app/app-shell/framework-services/local.storage.service';
import { SALON_GUID_NAME } from 'src/app/app-shell/framework-services/configuration';
import { PowderTypeService } from '../../powder-type/powder-type.service';
import { WireScrewService } from '../../wire-screw/wire-screw.service';
import * as moment from 'jalali-moment'
import { WireTypeService } from '../../wire-type/wire-type.service';

@Component({
  selector: 'app-daily-record-ops',
  templateUrl: './daily-record-ops.component.html'
})
export class DailyRecordOpsComponent implements OnInit {

  guid
  form: FormGroup
  salonGuid
  salon
  details = []
  shifts = []
  machines = []
  personnels = []
  activities = []
  gasTypes = []
  projects = []
  powderTypes = []
  wireScrews = []
  heads = [
    { guid: 1, title: 'یک' },
    { guid: 2, title: 'دو' },
    { guid: 3, title: 'همه هد ها' },
  ]
  activityTypes = activityTypes
  summary = {
    totalHours: '00:00',

    totalActivityHours: '00:00',
    totalWeldingActivityHours: '00:00',
    totalNonWeldingActivityHours: '00:00',

    totalStopHours: '00:00',
    totalProductionStopHours: '00:00',
    totalNonProductionStopHours: '00:00',
    totalWireConsumption: 0
  }

  wireTypes = []
  salonType
  selectedMachineHeadCount = 1

  productionWireScrews = []

  constructor(
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly salonService: SalonService,
    private readonly localStorageService: LocalStorageService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly breadcrumbService: BreadcrumbService,
    private readonly dailyRecordService: DailyRecordService,
    private readonly notificationService: NotificationService,
    private readonly listItemService: ListItemService,
    private readonly machineService: MachineService,
    private readonly personnelService: PersonnelService,
    private readonly projectService: ProjectService,
    private readonly activityService: ActivityService,
    private readonly gasTypeService: GasTypeService,
    private readonly powderTypeService: PowderTypeService,
    private readonly wireScrewService: WireScrewService,
    private readonly wireTypeService: WireTypeService) {
    this.form = this.fb.group({
      guid: [''],
      machineGuid: ['', [
        Validators.required
      ]],
      head: ['1', [
        Validators.required
      ]],
      date: ['', [
        Validators.required
      ]],
      shiftGuid: ['', [
        Validators.required
      ]],
      description: ['']
    })
  }

  ngOnInit(): void {
    this.guid = this.activatedRoute.snapshot.paramMap.get('guid')
    const onlyActive = this.guid ? false : true

    this.salonGuid = this.localStorageService.getItem(SALON_GUID_NAME)
    this.salonService
      .getForEdit(this.salonGuid)
      .subscribe((data: any) => {
        this.salonType = data.salonType

        if (this.salonType == 1) {
          this.wireTypeService
            .getForCombo()
            .subscribe((data: []) => {
              this.wireTypes = data
            })
        }
      })

    this.wireScrewService
      .getProductionWireScrews({ guid: this.guid })
      .subscribe((data: []) => {
        this.productionWireScrews = data
      })

    this.activityService
      .getForCombo<[]>(this.salonGuid)
      .subscribe(data => {
        this.activities = data

        this.wireScrewService
          .getForCombo<[]>()
          .subscribe(data => {
            this.wireScrews = data

            this.projectService
              .getForComboBy({ onlyActive })
              .subscribe((data: []) => {
                this.projects = data

                this.machineService
                  .getForCombo<ComboBase[]>(this.salonGuid)
                  .subscribe(data => {
                    this.machines = data

                    if (this.guid)
                      this.getForEdit()
                    else {
                      const yesterday = moment().subtract(1, 'days').locale('fa').format('jYYYY/jMM/jDD')
                      this.form.get('date').setValue(yesterday)
                    }

                    this.salonService
                      .getForEdit(this.salonGuid)
                      .subscribe(data => {
                        this.salon = data
                        this.breadcrumbService.reset()
                        const title = `فرم اطلاعات روزانه - ${this.salon?.name}`
                        this.breadcrumbService.setTitle(title)
                      })
                  })

                this.listItemService
                  .getForCombo<ComboBase[]>('10')
                  .subscribe(data => this.shifts = data)

                this.personnelService
                  .getForComboBy<ComboBase[]>({ salonGuid: this.salonGuid, onlyActive })
                  .subscribe(data => this.personnels = data)

                this.gasTypeService
                  .getForCombo<ComboBase[]>()
                  .subscribe(data => this.gasTypes = data)

                this.powderTypeService
                  .getForCombo<[]>()
                  .subscribe(data => this.powderTypes = data)
              })
          })
      })
  }

  getForEdit() {
    this.dailyRecordService
      .getForEdit(this.guid)
      .subscribe((data: any) => {
        this.form.patchValue(data)
        this.onMachineGuidChange()

        this.details = data.details
        this.details.forEach(detail => {
          detail.activities = this.activities.filter(x => x.type == detail.activityType)
          if (detail.wireTypeGuid)
            detail.projectDetailItemNo = `${detail.projectDetailGuid.toLowerCase()}@${detail.wireTypeGuid.toLowerCase()}`

          this.onProjectGuidChange(detail.guid, true)
          this.onPartTypeGuidChange(detail.guid, true)
          this.onPartCodeChange(detail.guid, true)
        })

        this.summary.totalHours = data.totalHours
        this.summary.totalActivityHours = data.totalActivityHours
        this.summary.totalWeldingActivityHours = data.totalWeldingActivityHours
        this.summary.totalNonWeldingActivityHours = data.totalNonWeldingActivityHours
        this.summary.totalStopHours = data.totalStopHours
        this.summary.totalProductionStopHours = data.totalProductionStopHours
        this.summary.totalNonProductionStopHours = data.totalNonProductionStopHours
        this.summary.totalWireConsumption = data.totalWireConsumption

        this.calculateSummary()
      })
  }

  addDetail() {
    const defaultActivityType = 1
    const record = {
      guid: createGuid(),
      activityType: defaultActivityType,
      activities: this.activities.filter(x => x.type == defaultActivityType)
    }

    this.details.push(record)
  }

  removeDetail(guid) {
    const index = this.details.findIndex(x => x.guid == guid)
    this.details.splice(index, 1)

    this.calculateSummary()
  }

  submit(action) {
    const command = this.form.getRawValue()
    command.salonGuid = this.salonGuid
    command.details = this.details

    command.totalHours = this.summary.totalHours
    command.totalActivityHours = this.summary.totalActivityHours
    command.totalWeldingActivityHours = this.summary.totalWeldingActivityHours
    command.totalNonWeldingActivityHours = this.summary.totalNonWeldingActivityHours
    command.totalStopHours = this.summary.totalStopHours
    command.totalProductionStopHours = this.summary.totalProductionStopHours
    command.totalNonProductionStopHours = this.summary.totalNonProductionStopHours
    command.totalWireConsumption = this.summary.totalWireConsumption

    if (this.details.map(x => x.wireConsumption).find(x => x < 0)) {
      this.notificationService.error('مصرف سیم نمی تواند منفی باشد.')
      return
    }

    if (
      this.details.some(x => x.activityType == 1 && x.activitySubType == 1 && (!x.wireConsumption || !x.wireTypeGuid || !x.wireScrewGuid))) {
      this.notificationService.error('در فعالیت های جوشکاری ورود اطلاعات برای سیم اجباری می باشد.')
      return
    }

    if (command.guid) {
      this.dailyRecordService
        .edit(command)
        .subscribe(data => {
          this.handleSubmit(action, command.guid)
        })
    } else {

      if (command.head == 3) {
        command.head = 1
        this.dailyRecordService
          .create(command)
          .subscribe(guid => {
            command.head = 2
            this.dailyRecordService
              .create(command)
              .subscribe(guid => {
                this.handleSubmit(1, null)
              })
          })
      } else {
        this.dailyRecordService
          .create(command)
          .subscribe(guid => {
            this.handleSubmit(action, guid)
          })
      }
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
        this.router.navigateByUrl(`/basic-info/daily-record-ops/${guid}`)
      }
    }
  }

  navigateToList() {
    this.router.navigateByUrl(`basic-info/daily-record/${this.salonGuid}`)
  }

  cloneDetail(guid) {
    const detail = JSON.parse(JSON.stringify(this.details.find(x => x.guid == guid)))
    detail.id = 0
    detail.guid = createGuid()
    detail.startTime = ''
    detail.endTime = ''
    detail.totalHours = 0
    // detail.wireTypeGuid = null
    detail.wireScrewGuid = null
    detail.wireConsumption = null
    this.details.push(detail)
  }

  activityTypeChanged(guid, activityType) {
    const detail = this.details.find(x => x.guid == guid)
    detail.activities = this.activities.filter(x => x.type == activityType)
    detail.activityType = activityType
    detail.activitySubType = null
    detail.activityGuid = null
    detail.gasTypeGuid = null
    detail.powderTypeGuid = null
    detail.wireTypeGuid = null
    detail.wireScrewGuid = null
    detail.wireConsumption = null
    detail.producedWireTypeGuid = null
    detail.producedScrew = null
    detail.producedWire = null

    this.calculateSummary()
  }

  calculateTime(detail) {

  }

  calculateSummary() {
    let totalHours = 0
    let totalMinutes = 0

    this.details
      .filter(x => x.activityGuid)
      .forEach(detail => {
        const activity = this.activities.find(x => x.guid == detail.activityGuid)
        detail.activitySubType = activity.subType

        const startHours = parseInt(detail.startTime.substring(0, 2))
        const startMinutes = parseInt(detail.startTime.substring(2, 4))

        const endHours = parseInt(detail.endTime.substring(0, 2))
        const endMinutes = parseInt(detail.endTime.substring(2, 4))

        let finalHours = endHours - startHours

        if (finalHours < 0)
          finalHours += 24

        let finalMinutes = endMinutes - startMinutes

        if (finalMinutes < 0) {
          finalHours -= 1
          finalMinutes += 60
        }

        detail.finalMinutes = finalMinutes
        detail.finalHours = finalHours

        totalHours += finalHours
        totalMinutes += finalMinutes

        detail.totalHours = parseFloat(finalHours + '.' + finalMinutes)
      })

    this.summary.totalHours = this.calculateTotalHours(this.details)

    this.summary.totalActivityHours = this.calculateTotalHours(this.details.filter(x => x.activityType == 1))

    this.summary.totalWeldingActivityHours = this.calculateTotalHours(this.details
      .filter(x => x.activityType == 1)
      .filter(x => x.activitySubType == 1))

    this.summary.totalNonWeldingActivityHours = this.calculateTotalHours(this.details
      .filter(x => x.activityType == 1)
      .filter(x => x.activitySubType == 2))

    this.summary.totalStopHours = this.calculateTotalHours(this.details
      .filter(x => x.activityType == 2))

    this.summary.totalProductionStopHours = this.calculateTotalHours(this.details
      .filter(x => x.activityType == 2)
      .filter(x => x.activitySubType == 3))

    this.summary.totalNonProductionStopHours = this.calculateTotalHours(this.details
      .filter(x => x.activityType == 2)
      .filter(x => x.activitySubType == 4))

    this.summary.totalWireConsumption = this.details
      .filter(x => x.wireConsumption)
      .filter(x => x.activityType == 1)
      .filter(x => x.activitySubType == 1)
      .reduce((a, b) => a + parseFloat(b.wireConsumption), 0)
  }

  calculateTotalHours(details): string {
    const totalMinutes = details.reduce((a, b) => a + b.finalMinutes, 0)
    let totalHours = details.reduce((a, b) => a + b.finalHours, 0)

    let remainingHours = Math.floor(totalMinutes / 60)
    totalHours += remainingHours

    const remainingMinutes = totalMinutes % 60

    return totalHours + '.' + remainingMinutes
  }

  onProjectGuidChange(guid, firstCall = false) {
    const detail = this.details.find(x => x.guid == guid)

    if (!detail.projectGuid) {
      detail.partGuid = ''
      detail.partCode = ''
      detail.projectDetailGuid = ''
      detail.projectDetailItemNo = ''
      detail.wireTypeGuid = ''
      detail.wireScrewGuid = ''
      detail.wireScrews = []

      return
    }

    const searchModel = {
      projectGuid: detail.projectGuid
    }

    this.projectService
      .getProjectStep(searchModel)
      .subscribe(data => {
        detail.partTypes = data
        if (!firstCall) {
          detail.partGuid = ''
          detail.partCode = ''
          detail.projectDetailGuid = ''
          detail.projectDetailItemNo = ''
          detail.wireTypeGuid = ''
          detail.wireScrewGuid = ''
          detail.wireScrews = []
        }
      })
  }

  onPartTypeGuidChange(guid, firstCall = false) {
    const detail = this.details.find(x => x.guid == guid)

    if (!detail.partGuid) {
      detail.partCode = ''
      detail.projectDetailGuid = ''
      detail.projectDetailItemNo = ''
      detail.wireTypeGuid = ''
      detail.wireScrewGuid = ''
      detail.wireScrews = []

      return
    }
    const searchModel = {
      projectGuid: detail.projectGuid,
      partGuid: detail.partGuid
    }

    if (searchModel.projectGuid == "00000000-0000-0000-0000-000000000000"
    ) return;

    this.projectService
      .getProjectStep(searchModel)
      .subscribe(data => {
        detail.partCodes = data
        if (!firstCall) {
          detail.partCode = ''
          detail.projectDetailGuid = ''
          detail.projectDetailItemNo = ''
          detail.wireTypeGuid = ''
          detail.wireScrewGuid = ''
          detail.wireScrews = []
        }
      })
  }

  onPartCodeChange(guid, firstCall = false) {
    const detail = this.details.find(x => x.guid == guid)

    if (!detail.partCode) {
      detail.projectDetailItemNo = ''
      detail.projectDetailGuid = ''
      detail.wireTypeGuid = ''
      detail.wireScrewGuid = ''
      detail.wireScrews = []

      return
    }

    const searchModel = {
      projectGuid: detail.projectGuid,
      partGuid: detail.partGuid,
      partCode: detail.partCode
    }

    if (searchModel.projectGuid == "00000000-0000-0000-0000-000000000000"
    ) return;

    this.projectService
      .getProjectStep(searchModel)
      .subscribe(data => {
        detail.projectDetails = data
        detail.projectDetails.forEach(projectDetail => {
          if (projectDetail.wireTypeGuid)
            projectDetail.itemNo = `${projectDetail.guid.toLowerCase()}@${projectDetail.wireTypeGuid.toLowerCase()}`
        })

        if (!firstCall) {
          detail.projectDetailItemNo = ''
          detail.projectDetailGuid = ''
          detail.wireTypeGuid = ''
          detail.wireScrewGuid = ''
          detail.wireScrews = []
        }

        if (detail.activityType != 1 || detail.activitySubType != 1) {
          const firstProjectDetail = detail.projectDetails[0]
          if (firstProjectDetail) {
            detail.projectDetailItemNo = firstProjectDetail.itemNo
            detail.projectDetailGuid = firstProjectDetail.guid
          }
        }

        this.onProjectDetailGuidChange(detail.guid)
      })
  }

  onProjectDetailGuidChange(guid) {
    const detail = this.details.find(x => x.guid == guid)
    if (detail.projectDetailItemNo) {
      const projectDetail = detail.projectDetails.find(x => x.itemNo.toLowerCase() == detail.projectDetailItemNo.toLowerCase())

      detail.wireTypeGuid = detail.projectDetailItemNo.split('@')[1]

      detail.projectDetailGuid = projectDetail.guid

      detail.wireScrews = this.wireScrews.filter(x => x.wireTypeGuid == detail.wireTypeGuid)
    }
  }

  onMachineGuidChange() {
    const machineGuid = this.form.get('machineGuid').value
    const machine = this.machines.find(x => x.guid == machineGuid)
    this.selectedMachineHeadCount = machine.headCount

    if (this.selectedMachineHeadCount == 1) {
      this.form.get('head').setValue(1)
    }

  }

  onWireTypeChange(guid) {
  }

  goPrevDay() {
    const date = this.form.get('date').value
    const m = moment.from(date, 'fa', 'YYYY/MM/DD').subtract(1, 'days').locale('fa').format('jYYYY/jMM/jDD')
    this.form.get('date').setValue(m)
  }

  goNextDay() {
    const date = this.form.get('date').value
    const m = moment.from(date, 'fa', 'YYYY/MM/DD').add(1, 'days').locale('fa').format('jYYYY/jMM/jDD')
    this.form.get('date').setValue(m)
  }
}