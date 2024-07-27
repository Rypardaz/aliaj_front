import { AG_GRID_SEARCH_PERIOD_TYPE_Name } from '../../framework-services/configuration'
import { LocalStorageService } from '../../framework-services/local.storage.service'
import { SettingService } from '../../framework-services/setting.service'
import { getCurrentMonth, months, sessions } from '../constants'
import { Component, EventEmitter, OnInit, Output } from '@angular/core'
declare var $: any

@Component({
  selector: 'grid-search-panel',
  templateUrl: './grid-search-panel.component.html'
})
export class GridSearchPanelComponent implements OnInit {

  months = months
  sessions = sessions
  calendarType = 1 //parseInt(this.settingService.getSettingValue('CalendarType'))
  searchModel = {
    periodId: getCurrentMonth(this.calendarType),
    searchType: 0,
    fromDate: '',
    toDate: ''
  }

  @Output() search = new EventEmitter<any>()

  constructor(private readonly localStorageService: LocalStorageService) { }

  ngOnInit(): void {
    const period_type = this.localStorageService.getItem(AG_GRID_SEARCH_PERIOD_TYPE_Name)

    if (period_type) {
      const value = period_type.split(',');
      this.searchModel.periodId = parseInt(value[0]);
      this.searchModel.searchType = parseInt(value[1]);
    }
    
    this.search.emit(this.searchModel)
  }

  getCurrentMonthName() {
    const periodId = this.searchModel.periodId
    switch (this.searchModel.searchType) {
      case 1:
        const month = this.months.find(x => x.id == periodId)
        if (this.calendarType == 1) {
          return month.name
        } else {
          return month.miladi
        }
      case 2:
        const session = this.sessions.find(x => x.id == periodId)
        if (this.calendarType == 1) {
          return session.name
        } else {
          return session.miladi
        }
      case 3:
        return ` از ${this.searchModel.fromDate} تا ${this.searchModel.toDate}`
      default:
        return "بدون شرط"
    }
  }

  emitSearch(periodId, searchType) {
    this.searchModel.periodId = periodId
    this.searchModel.searchType = searchType
    this.searchModel.fromDate = '';
    this.searchModel.toDate = '';

    this.localStorageService.setItem(AG_GRID_SEARCH_PERIOD_TYPE_Name, `${periodId},${searchType}`);
   
    this.search.emit(this.searchModel)
  }

  customSeachSelected(dates) {
    this.searchModel.periodId = 0
    this.searchModel.searchType = 3
    this.searchModel.fromDate = dates.fromDate
    this.searchModel.toDate = dates.toDate

    this.search.emit(this.searchModel)
    $("#select-date-modal-2").modal("hide")
  }
}