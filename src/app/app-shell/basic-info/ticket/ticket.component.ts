import { ModalFormBaseComponent } from '../../framework-components/modal/modal-form-base.component'
import { EditDeleteCellRenderer } from '../../framework-components/ag-grid/edit-delete-cell-btn'
import { activityTypes } from '../../framework-components/constants'
import { AfterViewInit, Component } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { TicketService } from './ticket.service'
import { TicketModel } from './ticket.model'
import { UserService } from '../../user-management/services/user.service'

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html'
})
export class TicketComponent extends ModalFormBaseComponent<TicketService, TicketModel> implements AfterViewInit {

  users = []

  constructor(
    private readonly fb: FormBuilder,
    private readonly userService: UserService,
    ticketService: TicketService) {
    super('پیام', ticketService, 'BasicInformation_Ticket')

    this.form = this.fb.group({
      guid: [''],
      toUserGuid: ['', [Validators.required,]],
      message: ['', [Validators.required]]
    })
  }

  override ngOnInit(): void {
    super.ngOnInit()
    this.getUsers()

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

  getUsers() {
    this.userService
      .getForCombo()
      .subscribe((data: any) => {
        this.users = data
      })
  }

  override getList() {
    const searchModel = {
      type: 'output'
    }

    this.service
      .getTickets(searchModel)
      .subscribe(data => {
        this.records = data
      })
  }
}