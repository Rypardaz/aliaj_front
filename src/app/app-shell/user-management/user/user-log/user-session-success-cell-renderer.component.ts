import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-user-session-success-cell-renderer',
  template: `
    <ng-container [ngSwitch]="isSuccessful">
      <span *ngSwitchCase="false" class="bg-soft-danger text-danger px-1">ورود ناموفق</span>
      <span *ngSwitchCase="true" class="bg-soft-success text-success px-1">ورود موفق</span>
    </ng-container>
  `
})
export class UserSessionSuccessCellRendererComponent implements ICellRendererAngularComp {

  public isSuccessful: boolean
  public displayValue: string

  agInit(params: any): void {
    this.isSuccessful = params.data.isSuccessful

    this.displayValue = 'ورود ناموفق'
    if (params.data.isSuccessful) {
      this.displayValue = 'ورود موفق'
    }
  }

  refresh(params: any) {
    return false
  }
}