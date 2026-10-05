import { Injectable } from '@angular/core';
import { LocalStorageService } from './local.storage.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class AgGridStateService {

  constructor(private readonly localStorageService: LocalStorageService,
    private readonly notificationService: NotificationService) { }

  private makeStorageName(name) {
    return `${name}_colState`;
  }

  saveState(gridApi, name) {
    const storageName = this.makeStorageName(name)

    const state = {
      columns: gridApi.getColumnState(),
      filter: gridApi.getFilterModel()
    }

    this.localStorageService.setItem(storageName, JSON.stringify(state))
    this.notificationService.succeded("حالت جدول با موفقیت ذخیره شد.")
  }

  restoreState(gridApi, name) {
    const storageName = this.makeStorageName(name)
    const saved = this.localStorageService.getItem(storageName)
    const state = JSON.parse(saved)

    if (!state) {
      return false;
    }

    gridApi.applyColumnState({
      state: state.columns,
      applyOrder: true,
    })

    gridApi.setFilterModel(state.filter)

    return true
  }

  resetState(gridApi, name) {
    gridApi.resetColumnState()
    gridApi.setFilterModel(null)

    const storageName = this.makeStorageName(name)

    if (this.localStorageService.exists(storageName)) {
      this.localStorageService.removeItem(storageName)
    }

    this.notificationService.succeded("برگشت جدول به حالت پیش فرض با موفقیت انجام شد.")
  }
}