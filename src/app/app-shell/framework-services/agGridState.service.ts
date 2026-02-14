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

  saveState(gridApi, gridColumnApi, name) {
    const storageName = this.makeStorageName(name);

    const state = {
      columns: gridColumnApi.getColumnState(),
      filter: gridApi.getFilterModel()
    };

    this.localStorageService.setItem(storageName, JSON.stringify(state));
    this.notificationService.succeded("حالت جدول با موفقیت ذخیره شد.");
  }

  restoreState(gridApi, gridColumnApi, name) {
    const storageName = this.makeStorageName(name)
    const saved = localStorage.getItem(storageName)
    const state = JSON.parse(saved)

    if (!state) {
      return false;
    }

    // Columns
    gridColumnApi.applyColumnState({
      state: state.columns,
      applyOrder: true
    });

    // Filtering
    gridApi.setFilterModel(state.filter);

    return true
  }

  resetState(gridApi, gridColumnApi, name) {
    gridColumnApi.resetColumnState()
    gridApi.setFilterModel(null)

    const storageName = this.makeStorageName(name)
    if (this.localStorageService.exists(storageName)) {
      this.localStorageService.removeItem(storageName)
    }

    this.notificationService.succeded("برگشت جدول به حالت پیش فرض با موفقیت انجام شد.");
  }
}