import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbService } from 'src/app/app-shell/framework-services/breadcrumb.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/app-shell/framework-services/notification.service';
import { ListItemService } from '../../list-item/list-item.service';
import { TenderInquiryService } from '../tender-inquiry.service';
import { LocalStorageService } from 'src/app/app-shell/framework-services/local.storage.service';
import { IconButtonComponent } from '../../../framework-components/custom-buttons/icon-button.component';
import { NgxMaskDirective } from 'ngx-mask';
import { LabelIconButtonComponent } from '../../../framework-components/custom-buttons/label-icon-button.component';
import { LabelButtonComponent } from '../../../framework-components/custom-buttons/label-button.component';
import { CustomInputComponent } from '../../../framework-components/custom-controls/custom-input/custom-input.component';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-tender-inquiry-ops',
  templateUrl: './tender-inquiry-ops.component.html',
  imports: [FormsModule, ReactiveFormsModule, NgSelectModule, CustomInputComponent, LabelButtonComponent, LabelIconButtonComponent, NgxMaskDirective, IconButtonComponent]
})
export class TenderInquiryOpsComponent implements OnInit {

  guid
  form: FormGroup

  private readonly router = inject(Router)
  private readonly fb = inject(FormBuilder)
  private readonly activatedRoute = inject(ActivatedRoute)
  private readonly listItemService = inject(ListItemService)
  private readonly breadcrumbService = inject(BreadcrumbService)
  private readonly localStorageService = inject(LocalStorageService)
  private readonly notificationService = inject(NotificationService)
  private readonly tenderInquiryService = inject(TenderInquiryService)

  constructor() {
    this.form = this.fb.group({
      guid: ['']
    })
  }

  ngOnInit(): void {
    this.guid = this.activatedRoute.snapshot.paramMap.get('guid')
  }

  getForEdit() {
    this.tenderInquiryService
      .getForEdit(this.guid)
      .subscribe((data: any) => {
        this.form.patchValue(data)
      })
  }
}