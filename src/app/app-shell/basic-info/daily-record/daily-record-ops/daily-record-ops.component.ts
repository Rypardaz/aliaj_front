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
  projectDetails = []
  powderTypes = []
  wireScrews = []
  wireTypes = []
  heads = [
    { guid: 1, title: 'یک' },
    { guid: 2, title: 'دو' },
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

  selectedMachineHeadCount = 1
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
    private readonly wireTypeService: WireTypeService,
    private readonly wireScrewService: WireScrewService) {
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
    this.salonGuid = this.localStorageService.getItem(SALON_GUID_NAME)

    this.activityService
      .getForCombo<[]>()
      .subscribe(data => {
        this.activities = data

        if (this.guid)
          this.getForEdit()

        this.salonService
          .getForEdit(this.salonGuid)
          .subscribe(data => {
            this.salon = data
            this.breadcrumbService.reset()
            const title = `فرم اطلاعات روزانه - ${this.salon?.name}`
            this.breadcrumbService.setTitle(title)
          })

        this.listItemService
          .getForCombo<ComboBase[]>('10')
          .subscribe(data => this.shifts = data)

        this.machineService
          .getForCombo<ComboBase[]>(this.salonGuid)
          .subscribe(data => this.machines = data)

        this.personnelService
          .getForCombo<ComboBase[]>(this.salonGuid)
          .subscribe(data => this.personnels = data)

        this.gasTypeService
          .getForCombo<ComboBase[]>()
          .subscribe(data => this.gasTypes = data)

        this.projectService
          .detailsCombo(this.salonGuid)
          .subscribe(data => this.projectDetails = data)

        this.powderTypeService
          .getForCombo<[]>()
          .subscribe(data => this.powderTypes = data)

        this.wireTypeService
          .getForCombo<[]>()
          .subscribe(data => this.wireTypes = data)

        this.wireScrewService
          .getForCombo<[]>()
          .subscribe(data => this.wireScrews = data)
      })
  }

  getForEdit() {
    this.dailyRecordService
      .getForEdit(this.guid)
      .subscribe((data: any) => {
        this.form.patchValue(data)
        this.details = data.details
        this.details.forEach(detail => {
          detail.activities = this.activities.filter(x => x.type == detail.activityType)
        })

        this.summary.totalHours = data.totalHours
        this.summary.totalActivityHours = data.totalActivityHours
        this.summary.totalWeldingActivityHours = data.totalWeldingActivityHours
        this.summary.totalNonWeldingActivityHours = data.totalNonWeldingActivityHours
        this.summary.totalStopHours = data.totalStopHours
        this.summary.totalProductionStopHours = data.totalProductionStopHours
        this.summary.totalNonProductionStopHours = data.totalNonProductionStopHours
        this.summary.totalWireConsumption = data.totalWireConsumption
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

    if (command.guid) {
      this.dailyRecordService
        .edit(command)
        .subscribe(data => {
          this.handleSubmit()
        })
    } else {
      this.dailyRecordService
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
    this.router.navigateByUrl(`basic-info/daily-record/${this.salonGuid}`)
  }

  cloneDetail(guid) {
    const detail = JSON.parse(JSON.stringify(this.details.find(x => x.guid == guid)))
    detail.id = 0
    detail.guid = createGuid()
    detail.startTime = ''
    detail.endTime = ''
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

    this.calculateSummary()
  }

  calculateSummary() {
    this.summary.totalWireConsumption = this.details
      .filter(x => x.wireConsumption)
      .reduce((a, b) => a + parseFloat(b.wireConsumption), 0)

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
        let finalMinutes = endMinutes - startMinutes

        if (finalMinutes < 0) {
          finalMinutes += 60
        }

        finalMinutes = parseFloat((finalMinutes / 60).toFixed(2))

        detail.totalHours = finalHours + finalMinutes
      })

    this.summary.totalHours = this.details.reduce((a, b) => a + b.totalHours, 0).toFixed(2)

    this.summary.totalActivityHours = this.details
      .filter(x => x.activityType == 1)
      .reduce((a, b) => a + b.totalHours, 0)
      .toFixed(2)

    this.summary.totalWeldingActivityHours = this.details
      .filter(x => x.activityType == 1)
      .filter(x => x.activitySubType == 1)
      .reduce((a, b) => a + b.totalHours, 0)
      .toFixed(2)

    this.summary.totalNonWeldingActivityHours = this.details
      .filter(x => x.activityType == 1)
      .filter(x => x.activitySubType == 2)
      .reduce((a, b) => a + b.totalHours, 0)
      .toFixed(2)

    this.summary.totalStopHours = this.details
      .filter(x => x.activityType == 2)
      .reduce((a, b) => a + b.totalHours, 0)
      .toFixed(2)

    this.summary.totalProductionStopHours = this.details
      .filter(x => x.activityType == 2)
      .filter(x => x.activitySubType == 3)
      .reduce((a, b) => a + b.totalHours, 0)
      .toFixed(2)

    this.summary.totalNonProductionStopHours = this.details
      .filter(x => x.activityType == 2)
      .filter(x => x.activitySubType == 4)
      .reduce((a, b) => a + b.totalHours, 0)
      .toFixed(2)
  }

  onProjectDetailGuidChange(guid) {
    const detail = this.details.find(x => x.guid == guid)
    const projectDetail = this.projectDetails.find(x => x.guid == detail.projectDetailGuid)

    detail.gasTypeGuid = projectDetail.gasTypeGuid
    detail.powderTypeGuid = projectDetail.powderTypeGuid
    detail.wireTypeGuid = projectDetail.wireTypeGuid
    detail.wireScrewGuid = projectDetail.wireScrewGuid
    detail.wireConsumption = projectDetail.wireConsumption
  }

  onMachineGuidChange() {
    const machineGuid = this.form.get('machineGuid').value
    const machine = this.machines.find(x => x.guid == machineGuid)
    this.selectedMachineHeadCount = machine.headCount
  }
}