import { Component } from "@angular/core";
import { ICellRendererAngularComp } from "ag-grid-angular";
declare var $: any;

@Component({
    selector: 'yes-no-cell-renderer',
    template: `
    <span *ngIf="isOther">
        <span class="" style="padding: 3px">بلی</span>
    </span>
    <span *ngIf="!isOther">
        <span class="" style="padding: 3px">خیر</span>
    </span>`,
})
export class YesNoCellRenderer implements ICellRendererAngularComp {
    params: any;
    isOther: null;

    refresh(params: any): boolean {
        return true;
    }

    agInit(params: any): void {
        this.params = params;

        if (params.data) {
            if (params.data.isOther != null) {
                this.isOther = params.data.isOther
            }
        }
    }
}