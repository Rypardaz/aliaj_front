import { Component, OnInit } from '@angular/core';
import { WorkCalendarService } from './work-calendar.service';
import { getTodayDate, months } from '../../framework-components/constants';
import { ListItemService } from '../list-item/list-item.service';
import { NotificationService } from '../../framework-services/notification.service';
import { BreadcrumbService } from '../../framework-services/breadcrumb.service';
import { SalonService } from '../salon/salon.service';

@Component({
  selector: 'app-work-calendar',
  templateUrl: './work-calendar.component.html'
})
export class WorkCalendarComponent implements OnInit {

  records = []
  years = [
    { guid: 1402, title: 1402 },
    { guid: 1403, title: 1403 },
    { guid: 1404, title: 1404 },
  ]
  months = months
  closeTypes = []
  yearId: number
  monthId: number
  salonGuid: string
  salons = []

  constructor(
    private readonly listItemService: ListItemService,
    private readonly notificationService: NotificationService,
    private readonly workCalendarService: WorkCalendarService,
    private readonly breadcrumbService: BreadcrumbService,
    private readonly salonService: SalonService) {
  }

  ngOnInit(): void {
    this.getCloseTypes()
    const today = getTodayDate()
    this.yearId = parseInt(today.split('/')[0])
    this.monthId = parseInt(today.split('/')[1])
    this.breadcrumbService.setTitle('ساعت‌کاری')

    this.salonService
      .getForCombo()
      .subscribe((data: []) => {
        this.salons = data
      })
  }

  getCloseTypes() {
    this.listItemService
      .getForCombo<[]>('12')
      .subscribe(data => this.closeTypes = data)
  }

  getList() {
    if (!this.yearId || !this.monthId || !this.salonGuid) {
      this.notificationService.error('لطفا سال و ماه و سالن را به درستی انتخاب کنید.')
      return
    }

    const searchModel = {
      yearId: this.yearId,
      monthId: this.monthId,
      salonGuid: this.salonGuid
    }

    this.workCalendarService
      .getWorkCalendars(searchModel)
      .subscribe(data => {
        this.records = data
      })
  }

  onIsClosedChange(item) {
    if (!item.isClosed)
      item.closedTypeId = null

    this.itemEdited(item)
  }

  itemEdited(item) {
    item.isEdited = true
  }

  submit() {
    const items = this.records.filter(x => x.isEdited)
    if (!items.length) {
      this.notificationService.error('هیچ تغییری برای شناسایی نشد.')
      return
    }

    const command = {
      items
    }

    this.workCalendarService
      .edit(command)
      .subscribe(() => {
        this.getList()
        this.notificationService.succeded()
      })
  }
}