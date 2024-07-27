import { AllModules } from '@ag-grid-enterprise/all-modules';
import { ConfirmationStateCellRenderer } from '../ag-grid/confirmation-state-label-cell';
import { EditDeleteCellRenderer } from '../ag-grid/edit-delete-cell-btn';
import { GoToDocumentCellBtnRenderer } from '../ag-grid/go-to-document-cell-btn-renderer';
import { IsCanceledCellRenderer } from '../ag-grid/is-canceled-label-cell';
import { TaxStateCellRenderer } from '../ag-grid/tax-state-label-cell';
import { ValidateionStateCellRenderer } from '../ag-grid/validation-state-label-cell';
import { Component, EventEmitter, Inject, Output, inject } from '@angular/core';
import { AppSharedDataComponent } from '../app-shared-data/app-shared-data.component';
import { ImageCellRenderer } from '../ag-grid/image-cell-renderer';
import { LocalStorageService } from '../../framework-services/local.storage.service';
import { SettingService } from '../../framework-services/setting.service';
import { AG_GRID_LOCALE_FA } from './locale.fa';
import { Module } from 'ag-grid-community';
declare var Swal: any;

@Component({
  selector: 'app-ag-grid-base',
  template: ''
})
export class AgGridBaseComponent extends AppSharedDataComponent {

  public childName: string;
  public gridApi;
  public gridColumnApi;
  public modules: any[] = AllModules;
  gridOptions: any
  @Output() afterGridReady = new EventEmitter<number>()

  constructor(@Inject(Boolean) hasPinnedRow = false) {
    super();

    this.gridOptions = {
      defaultColDef: {
        flex: 1,
        resizable: true,
        filter: true,
        sortable: true,
        minWidth: 150,
        enableValue: true,
        enableRowGroup: true,
        enablePivot: true,
      },
      autoGroupColumnDef: { minWidth: 200 },
      rowGroupPanelShow: 'always',
      pivotPanelShow: 'always',
      statusBar: {
        statusPanels: [
          {
            statusPanel: 'agTotalAndFilteredRowCountComponent',
            align: 'left',
          },
          {
            statusPanel: 'agTotalRowCountComponent',
            align: 'center',
          },
          { statusPanel: 'agFilteredRowCountComponent' },
          { statusPanel: 'agSelectedRowCountComponent' },
          { statusPanel: 'agAggregationComponent' },
        ]
      },
      context: { componentParent: this },
      localeText: AG_GRID_LOCALE_FA,
      enableRtl: true,
      animateRows: true,
      pagination: true,
      columnHoverHighlight: true,
    }
  }

  public components: { [p: string]: any; } = {
    editDeleteCellRenderer: EditDeleteCellRenderer,
    imageCellRenderer: ImageCellRenderer,
    validationStateCellRenderer: ValidateionStateCellRenderer,
    taxStateCellRenderer: TaxStateCellRenderer,
    confirmationStateCellRenderer: ConfirmationStateCellRenderer,
    isCanceledCellRenderer: IsCanceledCellRenderer,
    goToDocumentCellRenderer: GoToDocumentCellBtnRenderer
  };

  fireDeleteSwal() {
    return Swal.fire({
      title: "آیا از حذف این ردیف اطمینان دارید؟",
      text: "درصورت حذف دیگر قادر به بازیابی ردیف فوق نخواهید بود.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "بله، اطمینان دارم.",
      cancelButtonText: "خیر",
      confirmButtonClass: "btn btn-success mx-2",
      cancelButtonClass: "btn btn-danger",
      buttonsStyling: !1,
    });
  }

  fireDeleteSucceddedSwal() {
    Swal.fire({
      title: "ردیف فوق با موفقیت حذف شد.",
      type: "success",
    })
  }

  dismissDeleteSwal(t) {
    t.dismiss === Swal.DismissReason.cancel;
  }

  onClearRange() {
    this.gridApi.clearRangeSelection();
  }

  removeAllFilters() {
    this.gridApi.setFilterModel(null);
  }

  onExportExcel() {
    this.gridApi.exportDataAsExcel();
  }

  onExportCSV() {
    this.gridApi.exportDataAsCsv();
  }
  setColumnsVisible(colName: string, state: boolean) {
    this.gridColumnApi.setColumnsVisible(colName, state)
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.gridApi.hideOverlay();
  }

  openNav() {
    $("#sidefilter").css('width', "400px")
    $(".rightbar-overlay").addClass("d-block")
    var self = this
    $(".rightbar-overlay").on("click", function () {
      self.closeNav()
    })
  }

  closeNav() {
    $("#sidefilter").css('width', "0px")
    $(".rightbar-overlay").removeClass("d-block")
  }
}