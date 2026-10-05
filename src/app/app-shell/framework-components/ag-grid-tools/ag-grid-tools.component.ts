import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AgGridStateService } from '../../framework-services/agGridState.service';

import { LabelIconButtonComponent } from '../custom-buttons/label-icon-button.component';

@Component({
  selector: 'ag-grid-tools',
  templateUrl: './ag-grid-tools.component.html',
  imports: [LabelIconButtonComponent]
})
export class AgGridToolsComponent implements OnInit, OnChanges {

  @Input({ required: true, alias: 'name' }) name: string
  @Input({ required: true, alias: 'gridApi' }) gridApi

  hasSavedState: boolean = false

  constructor(private readonly agGridStateService: AgGridStateService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.name && this.gridApi) {
      this.restoreState();
    }
  }

  ngOnInit(): void {
  }

  saveState() {
    this.agGridStateService.saveState(this.gridApi, this.name)
    this.hasSavedState = true;
  }

  restoreState() {
    this.hasSavedState = this.agGridStateService.restoreState(this.gridApi, this.name)
  }

  resetState() {
    this.agGridStateService.resetState(this.gridApi, this.name);
    this.hasSavedState = false;
  }

  onExportExcel() {
    this.gridApi.exportDataAsExcel();
  }

  onExportCSV() {
    this.gridApi.exportDataAsCsv();
  }
}