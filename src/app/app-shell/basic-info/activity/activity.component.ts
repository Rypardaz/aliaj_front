import { AfterViewInit, Component } from '@angular/core';
import { ModalFormBaseComponent } from '../../framework-components/modal/modal-form-base.component'
import { FormBuilder, Validators } from '@angular/forms'
import { ActivityModel } from './activity-model'
import { ActivityService } from "./activity.service"
import { EditDeleteCellRenderer } from '../../framework-components/ag-grid/edit-delete-cell-btn';
import { activitySubTypes, activityTypes } from '../../framework-components/constants';
import { ListItemService } from '../list-item/list-item.service';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html'
})
export class ActivityComponent extends ModalFormBaseComponent<ActivityService, ActivityModel> implements AfterViewInit {
  activityTypes = activityTypes
  activitySubTypes = []
  sources = []

  constructor(private readonly fb: FormBuilder,
    activityService: ActivityService,
    private readonly listItemService: ListItemService) {
    super('کد فعالیت/توقف', activityService, 'BasicInformation_MissionType')

    this.form = this.fb.group({
      guid: [''],
      name: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(100)
      ]],
      type: [1, [
        Validators.required
      ]],
      subType: [1, [
        Validators.required
      ]],
      sourceGuid: [null],
      isOther: [false],
    })

    this.form
      .get('type')
      .valueChanges
      .subscribe(type => {
        this.activitySubTypes = activitySubTypes.filter(x => x.type == type)

        this.setFormValue(this.form, 'sourceGuid', null)
      })

    this.afterReset
      .subscribe(reset => {
        this.setFormValue(this.form, "isOther", true)
      })
  }

  get type() {
    return this.getFormValue(this.form, 'type')
  }

  override ngOnInit(): void {
    super.ngOnInit()
    this.getSources()
    this.gridOptions.columnDefs = [
      {
        field: 'ویرایش/حذف/وضعیت',
        pinned: "left",
        cellRenderer: EditDeleteCellRenderer,
        cellRendererParams: {
          editPermission: "BasicInformation_MissionType",
          deletePermission: "BasicInformation_MissionType",
          editInModal: true,
          hasActiveMode: true,
          hasEditMode: true,
          hasDeleteMode: true
        },
        width: 200
      },
      {
        field: 'name',
        headerName: 'نام کد',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'typeStr',
        headerName: 'نوع',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'subTypeStr',
        headerName: 'زیر گروه',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'isOther',
        headerName: 'سایر فعالیت ها',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'isActiveStr',
        headerName: 'وضعیت',
        filter: 'agSetColumnFilter',
        cellClass: params => {
          return params.value == 'فعال' ? 'text-success' : 'text-danger';
        },
      }
    ]
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit()
  }

  getSources() {
    this.listItemService
      .getForCombo<[]>('13')
      .subscribe(data => this.sources = data)
  }
}