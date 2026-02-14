import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AgGridStateService } from '../../framework-services/agGridState.service';

@Component({
  selector: 'ag-grid-tools',
  templateUrl: './ag-grid-tools.component.html'
})
export class AgGridToolsComponent implements OnInit, OnChanges {

  @Input({ required: true, alias: 'name' }) name: string
  @Input({ required: true, alias: 'gridApi' }) gridApi
  @Input({ required: true, alias: 'gridColumnApi' }) gridColumnApi

  hasSavedState: boolean = false

  constructor(private readonly agGridStateService: AgGridStateService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.name && this.gridApi && this.gridColumnApi) {
      this.restoreState();
    }
  }

  ngOnInit(): void {
  }

  saveState() {
    this.agGridStateService.saveState(this.gridApi, this.gridColumnApi, this.name)
    this.hasSavedState = true;
  }

  restoreState() {
    this.hasSavedState = this.agGridStateService.restoreState(this.gridApi, this.gridColumnApi, this.name)
  }

  resetState() {
    this.agGridStateService.resetState(this.gridApi, this.gridColumnApi, this.name);
    this.hasSavedState = false;
  }

  onExportExcel() {
    this.gridApi.exportDataAsExcel();
  }
}