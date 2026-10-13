import { AgGridModule } from 'ag-grid-angular'
import { ProjectDossierModel } from './project-dossier-model'
import { ComboBase } from '../../framework-components/combo-base'
import { ProjectDossierService } from './project-dossier.service'
import { AfterViewInit, Component, ViewChild } from '@angular/core'
import { EditDeleteCellRenderer } from '../../framework-components/ag-grid/edit-delete-cell-btn'
import { ModalFormBaseComponent } from '../../framework-components/modal/modal-form-base.component'
import { AgGridToolsComponent } from '../../framework-components/ag-grid-tools/ag-grid-tools.component'
import { LabelIconButtonComponent } from '../../framework-components/custom-buttons/label-icon-button.component'
import { GridSearchPanelComponent } from '../../framework-components/grid-search-panel/grid-search-panel.component'

@Component({
  selector: 'app-project-dossier',
  templateUrl: './project-dossier.component.html',
  imports: [LabelIconButtonComponent, GridSearchPanelComponent, AgGridToolsComponent, AgGridModule]
})
export class ProjectDossierComponent extends ModalFormBaseComponent<ProjectDossierService, ProjectDossierModel> implements AfterViewInit {
  salonGuid
  salons: ComboBase[]
  searchModel: any

  @ViewChild(AgGridToolsComponent) agGridTools: AgGridToolsComponent

  constructor(projectDossierService: ProjectDossierService) {
    super('کارتابل پرونده پروژه', projectDossierService)
  }

  override async ngOnInit(): Promise<void> {
    this.gridOptions.columnDefs = [
      {
        field: 'عملیات',
        pinned: "left",
        cellRenderer: EditDeleteCellRenderer,
        cellRendererParams: {
          editPermission: "",
          deletePermission: "",
          hasActiveMode: false,
          hasEditMode: true,
          hasDeleteMode: true,
          editUrl: '/basic-info/pmis/project-dossier/edit'
        },
        width: 70
      },
      {
        field: 'projectCode',
        headerName: 'شماره پروژه (کد پروژه)',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'saleDepartmentName',
        headerName: 'واحد فروش',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'taskMasterName',
        headerName: 'کارفرما',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'applicationTypeName',
        headerName: 'نوع اپلیکیشن',
        filter: 'agSetColumnFilter'
      },
      {
        field: 'projectTypeName',
        headerName: 'نوع پروژه',
        filter: 'agSetColumnFilter'
      }
    ]
  }

  navigateToOps(guid = null) {
    const path = guid
      ? `/basic-info/pmis/project-dossier/edit/${guid}`
      : '/basic-info/pmis/project-dossier/create'

    this.router.navigateByUrl(path)
  }

  async searchList(searchModel) {
    this.searchModel = searchModel
    await this.getList()
  }
}