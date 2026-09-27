import { Component } from '@angular/core';
import { TicketModel } from '../ticket.model';
import { TicketService } from '../ticket.service';
import { EditDeleteCellRenderer } from 'src/app/app-shell/framework-components/ag-grid/edit-delete-cell-btn';
import { ModalFormBaseComponent } from 'src/app/app-shell/framework-components/modal/modal-form-base.component';
import { AgGridModule } from 'ag-grid-angular';

@Component({
    selector: 'app-inbox',
    templateUrl: './inbox.component.html',
    imports: [AgGridModule]
})
export class InboxComponent extends ModalFormBaseComponent<TicketService, TicketModel> {

  constructor(ticketService: TicketService) {
    super('پیام', ticketService, 'BasicInformation_Ticket')
  }

  override ngOnInit(): void {
    super.ngOnInit()

    this.gridOptions.columnDefs = [
      {
        field: 'حذف',
        pinned: "left",
        cellRenderer: EditDeleteCellRenderer,
        cellRendererParams: {
          editPermission: "BasicInformation_Ticket",
          deletePermission: "BasicInformation_Ticket",
          editInModal: true,
          hasActiveMode: false,
          hasEditMode: false,
          hasDeleteMode: true
        },
        width: 200
      },
      {
        field: 'fromUserFullname',
        headerName: 'ارسال کننده',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'toUserFullname',
        headerName: 'دریافت کننده',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'message',
        headerName: 'متن پیام',
        filter: 'agSetColumnFilter'
      }
    ]
  }

  override getList() {
    const searchModel = {
      type: 'input'
    }

    this.service
      .getTickets(searchModel)
      .subscribe(data => {
        this.records = data
      })
  }
}