import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, ParamMap, Router } from '@angular/router';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { BreadcrumbService } from '../../../framework-services/breadcrumb.service';
import { NotificationService } from '../../../framework-services/notification.service';
import { ListItemService } from '../../list-item/list-item.service';
import { ProjectTypeService } from '../../project-type/project-type.service';
import { TaskMasterService } from '../../task-master/task-master.service';
import { TenderInquiryService } from '../tender-inquiry.service';
import { TenderInquiryOpsComponent } from './tender-inquiry-ops.component';

describe('TenderInquiryOpsComponent', () => {
  let component: TenderInquiryOpsComponent;
  let service: jasmine.SpyObj<TenderInquiryService>;
  let router: jasmine.SpyObj<Router>;
  let notification: jasmine.SpyObj<NotificationService>;
  let routeParams: BehaviorSubject<ParamMap>;

  beforeEach(() => {
    service = jasmine.createSpyObj('TenderInquiryService', ['create', 'edit', 'getForEdit']);
    router = jasmine.createSpyObj('Router', ['navigateByUrl']);
    notification = jasmine.createSpyObj('NotificationService', ['succeded', 'error']);
    service.create.and.returnValue(of('created-guid'));
    service.edit.and.returnValue(of(undefined));
    service.getForEdit.and.returnValue(of({ guid: 'existing-guid', projectCode: 'S8901' }));
    routeParams = new BehaviorSubject(convertToParamMap({}));

    TestBed.configureTestingModule({
      imports: [TenderInquiryOpsComponent],
      providers: [
        { provide: TenderInquiryService, useValue: service },
        { provide: Router, useValue: router },
        { provide: NotificationService, useValue: notification },
        { provide: BreadcrumbService, useValue: { reset: () => {}, setTitle: () => {} } },
        { provide: ActivatedRoute, useValue: { paramMap: routeParams } },
        { provide: TaskMasterService, useValue: { getForCombo: () => of([]) } },
        { provide: ProjectTypeService, useValue: { getList: () => of([]) } },
        { provide: ListItemService, useValue: { getForCombo: () => of([]) } }
      ]
    }).overrideComponent(TenderInquiryOpsComponent, { set: { template: '' } });

    const fixture = TestBed.createComponent(TenderInquiryOpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.inquiryResults = [
      { guid: 'lost', title: 'باخت', id: 1, row: 1 },
      { guid: 'won', title: 'برد', id: 2, row: 2 }
    ];
  });

  function fillRequiredFields(): void {
    component.form.patchValue({
      projectCode: 'S8901', saleDepartmentGuid: 'sales', taskMasterGuid: 'customer',
      applicationTypeGuid: 'application', projectTypeGuid: 'project-type'
    });
  }

  it('enables loss details only for a lost inquiry', () => {
    expect(component.form.controls.winner.disabled).toBeTrue();
    component.form.controls.inquiryResultGuid.setValue('lost');
    expect(component.form.controls.lossReasonGuid.enabled).toBeTrue();
    expect(component.form.controls.winner.enabled).toBeTrue();
    expect(component.form.controls.winningAmount.enabled).toBeTrue();
    component.form.controls.inquiryResultGuid.setValue('won');
    expect(component.form.controls.lossReasonGuid.disabled).toBeTrue();
    expect(component.form.controls.winner.disabled).toBeTrue();
    expect(component.form.controls.winningAmount.disabled).toBeTrue();
  });

  it('does not submit an incomplete form', () => {
    component.submit(1);
    expect(service.create).not.toHaveBeenCalled();
    expect(component.form.controls.projectCode.touched).toBeTrue();
  });

  it('loads edit-route details and restores the loss fields', () => {
    service.getForEdit.and.returnValue(of({
      guid: 'existing-guid', projectCode: 'S8901', inquiryResultGuid: 'lost',
      lossReasonGuid: 'reason', winner: 'Company', winningAmount: 500
    }));
    routeParams.next(convertToParamMap({ guid: 'existing-guid' }));
    expect(service.getForEdit).toHaveBeenCalledWith('existing-guid');
    expect(component.form.controls.winner.value).toBe('Company');
    expect(component.form.controls.winningAmount.value).toBe(500);
    expect(component.form.controls.winner.enabled).toBeTrue();
    expect(component.isLoading).toBeFalse();
  });

  it('rejects negative and fractional amounts', () => {
    fillRequiredFields();
    component.form.controls.quotedAmount.setValue(-1);
    component.submit(1);
    component.form.controls.quotedAmount.setValue(1.5);
    component.submit(1);
    expect(service.create).not.toHaveBeenCalled();
  });

  it('omits retained loss details when saving another result', () => {
    fillRequiredFields();
    component.form.patchValue({ inquiryResultGuid: 'lost', lossReasonGuid: 'reason', winner: 'Company', winningAmount: 500 });
    component.form.controls.inquiryResultGuid.setValue('won');
    component.submit(1);
    expect(service.create).toHaveBeenCalledWith(jasmine.objectContaining({
      inquiryResultGuid: 'won', lossReasonGuid: null, winner: '', winningAmount: null
    }));
    expect(router.navigateByUrl).toHaveBeenCalledWith('/basic-info/pmis/tender-inquiry/list');
  });

  it('preserves loss details and opens the new edit route after saving', () => {
    fillRequiredFields();
    component.form.patchValue({ inquiryResultGuid: 'lost', lossReasonGuid: 'reason', winner: 'Company', winningAmount: 500 });
    component.submit(2);
    expect(service.create).toHaveBeenCalledWith(jasmine.objectContaining({
      lossReasonGuid: 'reason', winner: 'Company', winningAmount: 500
    }));
    expect(router.navigateByUrl).toHaveBeenCalledWith('/basic-info/pmis/tender-inquiry/edit/created-guid');
  });

  it('updates the existing record and prevents duplicate submissions', () => {
    fillRequiredFields();
    component.guid = 'existing-guid';
    const pending = new Subject<void>();
    service.edit.and.returnValue(pending);
    component.submit(1);
    component.submit(1);
    expect(service.edit).toHaveBeenCalledTimes(1);
    expect(service.edit).toHaveBeenCalledWith(jasmine.objectContaining({ guid: 'existing-guid' }));
    expect(service.create).not.toHaveBeenCalled();
    pending.next();
    pending.complete();
    expect(component.isSaving).toBeFalse();
  });
});
