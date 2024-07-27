import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { ICellRendererAngularComp } from "ag-grid-angular";
declare var $: any;

@Component({
    selector: 'edit-delete-cell-renderer',
    template: `
    <span *ngIf="params.hasEditMode">
        <a (click)="btnEditClicked()" class="btn btn-soft-primary btn-sm waves-effect waves-light"  *hasPermission="[params.editPermission]"> 
            <i class="fas fa-pen"></i>
        </a>
    </span>
    <span *ngIf="params.hasDeleteMode"  class="mx-1">
        <a (click)="btnDeleteClicked()" class="btn btn-soft-danger btn-sm waves-effect waves-light" *hasPermission="[params.deletePermission]"> 
            <i class="fas fa-trash-alt"></i>
        </a>
    </span>

    <ng-container *ngIf="params.hasActiveMode">
        <span *ngIf="isActive != 1">
            <a (click)="activate()" class="btn btn-soft-success btn-sm waves-effect waves-light" *hasPermission="[params.deletePermission]"> 
                <i class="fas fa-check"></i>
            </a>
        </span>
        <span *ngIf="isActive ==1 ">
            <a (click)="deactivate()" class="btn btn-soft-warning btn-sm waves-effect waves-light" *hasPermission="[params.deletePermission]"> 
                <i class="fas fa-times"></i>
            </a>
        </span>
    </ng-container>`,
})
export class EditDeleteCellRenderer implements ICellRendererAngularComp {
    params: any;
    isActive: 1;
    id: 0;

    constructor(private readonly router: Router) {
    }

    refresh(params: any): boolean {
        return true;
    }

    agInit(params: any): void {
        this.params = params;

        if (params.data) {
            if (params.data.isActive) {
                this.isActive = params.data.isActive;
            }

            if (params.data.id) {
                this.id = params.data.id;
            }
        }
    }

    btnDeleteClicked() {
        this.params.context
            .componentParent
            .delete(this.params.data.guid);
    }

    btnEditClicked() {
        if (this.params.editInModal) {
            this.params.context
                .componentParent
                .openOpsModal(this.params.data.guid);
        } else {
            this.router.navigateByUrl(`${this.params.editUrl}/${this.params.data.guid}`);
        }
    }

    activate() {
        this.params.context
            .componentParent
            .activate(this.params.data.guid);
    }

    deactivate() {
        this.params.context
            .componentParent
            .deactivate(this.params.data.guid);
    }
}