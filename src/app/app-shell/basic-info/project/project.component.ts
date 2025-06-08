import { AfterViewInit, Component } from '@angular/core';
import { ModalFormBaseComponent } from '../../framework-components/modal/modal-form-base.component'
import { FormBuilder, Validators } from '@angular/forms'
import { ProjectService } from "./project.service"
import { ProjectModel } from './project-model';
import { ComboBase } from '../../framework-components/combo-base';
import { SalonService } from '../salon/salon.service';
import { EditDeleteCellRenderer } from '../../framework-components/ag-grid/edit-delete-cell-btn';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html'
})
export class ProjectComponent extends ModalFormBaseComponent<ProjectService, ProjectModel> implements AfterViewInit {
  salons: ComboBase[];
  searchModel

  constructor(private readonly fb: FormBuilder,
    ProjectService: ProjectService,
    private readonly salonService: SalonService) {
    super('لیست پروژه‌ها', ProjectService, 'BasicInformation_MissionType')

    this.form = this.fb.group({
      guid: [''],
      code: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(20)
      ]],
      name: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(100)
      ]],
      taskMasterGuid: null,
      projectTypeGuid: null,
      salonGuid: null,
      deliveryDate: null,
      description: null
    })

    this.afterListFetch
      .subscribe(_ => {
        this.salonService
          .getForCombo<ComboBase[]>()
          .subscribe(data => this.salons = data)
      })
  }

  override ngOnInit(): void {
    super.ngOnInit()

    this.gridOptions.columnDefs = [
      {
        field: 'عملیات',
        pinned: "left",
        cellRenderer: EditDeleteCellRenderer,
        cellRendererParams: {
          editPermission: "BasicInformation_MissionType",
          deletePermission: "BasicInformation_MissionType",
          hasActiveMode: false,
          hasEditMode: true,
          hasDeleteMode: true,
          editUrl: '/basic-info/project-ops'
        },
        width: 70
      },
      {
        field: 'code',
        headerName: 'کد پروژه',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'projectTypeName',
        headerName: 'نوع پروژه',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'name',
        headerName: 'عنوان پروژه',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'taskMasterName',
        headerName: 'نام کارفرما',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'salonName',
        headerName: 'واحد کاری',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'deliveryDate',
        headerName: 'تاریخ تحویل',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'isActive',
        headerName: 'وضعیت',
        filter: 'agSetColumnFilter',
        cellClass: params => {
          if (params.value == 'فعال') return 'text-success'
          else if (params.value == 'متوقف شده') return 'text-warning'
          else return 'text-danger'
        }
      },
      // {
      //   field: 'description',
      //   headerName: 'توضیحات',
      //   filter: 'agSetColumnFilter'
      // },
      // {
      //   field: 'createdBy',
      //   headerName: 'ایجاد کننده',
      //   filter: 'agSetColumnFilter'
      // },
      // {
      //   field: 'created',
      //   headerName: 'تاریخ ایجاد',
      //   filter: 'agSetColumnFilter'
      // }
    ]
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit()
  }

  navigateTo(guid = null) {
    let path = 'basic-info/project-ops'
    if (guid) {
      path += `/${guid}`
    }

    this.router.navigateByUrl(path)
  }

  searchList(searchModel) {
    this.searchModel = searchModel
    this.getList()
  }

  override getList() {
    this.records = []
    this.service
      .getProjects(this.searchModel)
      .subscribe({
        next: data => this.handleListSubscription(data)
      })
  }
}