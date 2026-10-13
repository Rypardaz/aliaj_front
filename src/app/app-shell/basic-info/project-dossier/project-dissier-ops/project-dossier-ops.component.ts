import { CommonModule } from '@angular/common'
import { NgSelectComponent } from '@ng-select/ng-select'
import { ProjectDossierService } from '../project-dossier.service'
import { ListItemService } from '../../list-item/list-item.service'
import { AfterViewInit, Component, inject, OnInit } from '@angular/core'
import { TaskMasterService } from '../../task-master/task-master.service'
import { ComboBase } from 'src/app/app-shell/framework-components/combo-base'
import { ProjectTypeService } from '../../project-type/project-type.service'
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { AppSharedDataComponent } from 'src/app/app-shell/framework-components/app-shared-data/app-shared-data.component'
import { LabelIconButtonComponent } from 'src/app/app-shell/framework-components/custom-buttons/label-icon-button.component'
import { CustomInputComponent } from 'src/app/app-shell/framework-components/custom-controls/custom-input/custom-input.component'
import { ProjectDossierModel } from '../project-dossier-model'

@Component({
  selector: 'app-project-dossier-ops',
  templateUrl: './project-dossier-ops.component.html',
  imports: [CustomInputComponent, NgSelectComponent, LabelIconButtonComponent, CommonModule, ReactiveFormsModule, FormsModule]
})
export class ProjectDossierOpsComponent extends AppSharedDataComponent implements OnInit, AfterViewInit {
  guid: string
  formId = 'projectDossierOpsForm'

  taskMasters: ComboBase[] = []
  saleDepartments: ComboBase[] = []
  projectTypes: ComboBase[] = []
  applicationTypes: ComboBase[] = []

  private readonly fb = inject(FormBuilder)
  private readonly projectDossierService = inject(ProjectDossierService)
  private readonly taskMasterService = inject(TaskMasterService)
  private readonly projectTypeService = inject(ProjectTypeService)
  private readonly listItemService = inject(ListItemService)

  readonly form = this.fb.group({
    guid: [''],
    projectCode: ['', Validators.required],
    saleDepartmentGuid: ['', Validators.required],
    taskMasterGuid: ['', Validators.required],
    applicationTypeGuid: ['', Validators.required],
    projectTypeGuid: ['', Validators.required],
    description: [''],
  })

  constructor() {
    super()
  }

  ngAfterViewInit(): void {
  }

  override async ngOnInit(): Promise<void> {
    this.breadcrumbService.setTitle('پرونده پروژه')

    this.taskMasters = await this.execute(this.taskMasterService.getForCombo<ComboBase[]>())
    this.projectTypes = await this.execute(this.projectTypeService.getList<ComboBase[]>())
    this.saleDepartments = await this.execute(this.listItemService.getForCombo<ComboBase[]>('16'))
    this.applicationTypes = await this.execute(this.listItemService.getForCombo<ComboBase[]>('17'))

    const params = await this.execute(this.activatedRoute.paramMap)
    this.guid = params.get('guid')
    if (this.guid) this.getForEdit()
  }

  async getForEdit() {
    const result = await this.executeWithLoading(this.projectDossierService.getForEdit<ProjectDossierModel>(this.guid))
    this.form.patchValue(result)
  }

  async submit() {
    const command = this.form.getRawValue()

    const request$ = command.guid ? this.projectDossierService.edit(command) : this.projectDossierService.create(command)

    const result = await this.executeWithLoading(request$)
    if (result === undefined) return

    this.notificationService.succeded()
  }

  navigateToList() {
    this.router.navigateByUrl('/basic-info/pmis/project-dossier')
  }
}