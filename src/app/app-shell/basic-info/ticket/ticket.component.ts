import { ModalFormBaseComponent } from '../../framework-components/modal/modal-form-base.component'
import { EditDeleteCellRenderer } from '../../framework-components/ag-grid/edit-delete-cell-btn'
import { activityTypes } from '../../framework-components/constants'
import { AfterViewInit, Component } from '@angular/core'
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { TicketService } from './ticket.service'
import { TicketModel } from './ticket.model'
import { UserService } from '../user/user.service'
import { CustomInputComponent } from '../../framework-components/custom-controls/custom-input/custom-input.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ModalComponent } from '../../framework-components/modal/modal.component';
import { AgGridModule } from 'ag-grid-angular';
import { LabelIconButtonComponent } from '../../framework-components/custom-buttons/label-icon-button.component';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  imports: [LabelIconButtonComponent, AgGridModule, ModalComponent, FormsModule, ReactiveFormsModule, NgSelectModule, CustomInputComponent]
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

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit()
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

  override async getList() {
    const searchModel = {
      type: 'output'
    }

    this.records = await this.executeWithLoading(this.service.getTickets(searchModel))
  }
}