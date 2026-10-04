import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { finalize } from 'rxjs';
import { BreadcrumbService } from 'src/app/app-shell/framework-services/breadcrumb.service';
import { NotificationService } from 'src/app/app-shell/framework-services/notification.service';
import { ComboBase } from '../../../framework-components/combo-base';
import { LabelIconButtonComponent } from '../../../framework-components/custom-buttons/label-icon-button.component';
import { CustomInputComponent } from '../../../framework-components/custom-controls/custom-input/custom-input.component';
import { ListItemService } from '../../list-item/list-item.service';
import { ProjectTypeModel } from '../../project-type/project-type-model';
import { ProjectTypeService } from '../../project-type/project-type.service';
import { TaskMasterService } from '../../task-master/task-master.service';
import { TenderInquiryCommand } from '../tender-inquiry-model';
import { TenderInquiryService } from '../tender-inquiry.service';

type LookupName = 'saleDepartments' | 'applicationTypes' | 'inquiryResults' | 'lossReasons';

@Component({
  selector: 'app-tender-inquiry-ops',
  templateUrl: './tender-inquiry-ops.component.html',
  imports: [ReactiveFormsModule, NgSelectModule, CustomInputComponent, LabelIconButtonComponent]
})
export class TenderInquiryOpsComponent implements OnInit {
  guid: string | null = null;
  isSaving = false;
  isLoading = false;
  taskMasters: ComboBase[] = [];
  saleDepartments: ComboBase[] = [];
  applicationTypes: ComboBase[] = [];
  projectTypes: Pick<ComboBase, 'guid' | 'title'>[] = [];
  inquiryResults: ComboBase[] = [];
  lossReasons: ComboBase[] = [];

  private readonly lookupGroupIds: Record<LookupName, string> = {
    saleDepartments: '16',
    applicationTypes: '17',
    inquiryResults: '18',
    lossReasons: '19'
  };

  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly listItemService = inject(ListItemService);
  private readonly taskMasterService = inject(TaskMasterService);
  private readonly projectTypeService = inject(ProjectTypeService);
  private readonly breadcrumbService = inject(BreadcrumbService);
  private readonly notificationService = inject(NotificationService);
  private readonly tenderInquiryService = inject(TenderInquiryService);

  readonly form = this.fb.group({
    guid: [''],
    projectCode: ['', Validators.required],
    saleDepartmentGuid: ['', Validators.required],
    taskMasterGuid: ['', Validators.required],
    applicationTypeGuid: ['', Validators.required],
    projectTypeGuid: ['', Validators.required],
    description: [''],
    no: [''],
    documentReceivedDate: [''],
    submissionDeadline: [''],
    guaranteeReceivedDate: [''],
    inquirySentDate: [''],
    quotedAmount: [null as number | null, [Validators.min(0), Validators.pattern(/^\d+$/)]],
    inquiryResultGuid: [null as string | null],
    lossReasonGuid: [{ value: null as string | null, disabled: true }],
    winner: [{ value: '', disabled: true }],
    winningAmount: [{ value: null as number | null, disabled: true }, [Validators.min(0), Validators.pattern(/^\d+$/)]]
  });

  get isLoss(): boolean {
    return this.inquiryResults.find(item => item.guid === this.form.controls.inquiryResultGuid.value)?.title.trim() === 'باخت';
  }

  ngOnInit(): void {
    this.breadcrumbService.reset();
    this.breadcrumbService.setTitle('فرم استعلام / مناقصه');

    this.taskMasterService.getForCombo<ComboBase[]>()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => this.taskMasters = data);

    this.projectTypeService.getList<ProjectTypeModel[]>()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => this.projectTypes = data.map(item => ({ guid: item.guid, title: item.name })));

    for (const name of Object.keys(this.lookupGroupIds) as LookupName[]) {
      this.listItemService.getForCombo<ComboBase[]>(this.lookupGroupIds[name])
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(data => {
          this[name] = data;
          if (name === 'inquiryResults') this.updateLossFields();
        });
    }

    this.form.controls.inquiryResultGuid.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.updateLossFields());

    this.activatedRoute.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        this.guid = params.get('guid');
        if (this.guid) this.getForEdit();
      });
  }

  private updateLossFields(): void {
    const controls = [this.form.controls.lossReasonGuid, this.form.controls.winner, this.form.controls.winningAmount];
    for (const control of controls) {
      if (this.isLoss) control.enable({ emitEvent: false });
      else control.disable({ emitEvent: false });
    }
  }

  getForEdit(): void {
    this.isLoading = true;
    this.tenderInquiryService.getForEdit<TenderInquiryCommand>(this.guid)
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.isLoading = false))
      .subscribe(data => {
        this.form.patchValue({ ...data, guid: this.guid });
        this.updateLossFields();
        this.form.markAsPristine();
      });
  }

  submit(action: 1 | 2): void {
    if (this.isSaving || this.isLoading) return;
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.notificationService.error('لطفاً اطلاعات فرم را به‌درستی تکمیل کنید.');
      return;
    }

    const command: TenderInquiryCommand = {
      ...this.form.getRawValue(),
      guid: this.guid ?? '',
      lossReasonGuid: this.isLoss ? this.form.controls.lossReasonGuid.value : null,
      winner: this.isLoss ? this.form.controls.winner.value : '',
      winningAmount: this.isLoss ? this.form.controls.winningAmount.value : null
    };

    this.isSaving = true;
    const request = this.guid
      ? this.tenderInquiryService.edit(command)
      : this.tenderInquiryService.create<string>(command);

    request.pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.isSaving = false))
      .subscribe(guid => {
        this.notificationService.succeded();
        this.form.markAsPristine();
        if (action === 1) {
          this.navigateToList();
        } else if (this.guid) {
          this.getForEdit();
        } else {
          this.router.navigateByUrl(`/basic-info/pmis/tender-inquiry/edit/${guid}`);
        }
      });
  }

  navigateToList(): void {
    this.router.navigateByUrl('/basic-info/pmis/tender-inquiry/list');
  }
}
