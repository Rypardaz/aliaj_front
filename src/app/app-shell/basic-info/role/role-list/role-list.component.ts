import { Component, OnInit } from '@angular/core'
import { RoleService } from '../role.service'
import { Router, RouterLink } from '@angular/router'
import { AgGridBaseComponent } from 'src/app/app-shell/framework-components/ag-grid-base/ag-grid-base.component'
import { EditDeleteCellRenderer } from 'src/app/app-shell/framework-components/ag-grid/edit-delete-cell-btn'
import { IconButtonComponent } from '../../../framework-components/custom-buttons/icon-button.component';
import { LabelIconButtonComponent } from '../../../framework-components/custom-buttons/label-icon-button.component';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  imports: [LabelIconButtonComponent, RouterLink, IconButtonComponent]
})
export class RoleListComponent extends AgGridBaseComponent implements OnInit {

  userGroups

  constructor(private readonly router: Router,
    private readonly roleService: RoleService) {
    super()
  }

  override async ngOnInit(): Promise<void> {
    super.ngOnInit()
    this.gridOptions.columnDefs = [
      {
        field: 'عملیات',
        pinned: "left",
        cellRenderer: EditDeleteCellRenderer,
        cellRendererParams: {
          editUrl: '/user-management/user-group/edit'
        },
        width: 50
      },
      {
        field: 'titleFa',
        headerName: 'عنوان گروه کاربری'
      },
      {
        field: 'userCount',
        headerName: 'تعداد کاربران'
      },
      {
        headerName: 'ایجاد کننده',
        field: 'createdBy'
      },
      {
        headerName: 'تاریخ ایجاد',
        field: 'created'
      }
    ]

    this.getList()
  }

  getList() {
    this.roleService
      .getList()
      .subscribe(data => this.userGroups = data)
  }

  delete(id) {
    this.fireDeleteSwal().then((t) => {
      if (t.value === true) {
        this.deleteRecord(id)
      } else {
        this.dismissDeleteSwal(t)
      }
    })
  }

  deleteRecord(id) {
    this.roleService
      .delete(id)
      .subscribe(() => {
        this.getList()
        this.fireDeleteSucceddedSwal()
      })
  }

  navigateToEdit(id) {
    this.router.navigate(['user-management/user-group/edit', id])
  }
}
