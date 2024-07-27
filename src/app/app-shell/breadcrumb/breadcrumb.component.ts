import { AfterViewChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BreadcrumbService } from '../framework-services/breadcrumb.service';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html'
})
export class
  BreadcrumbComponent implements AfterViewChecked {

  title
  classificationLevel = 'عادی'

  constructor(readonly breadcrumbService: BreadcrumbService,
    private readonly cdr: ChangeDetectorRef) { }

  ngAfterViewChecked(): void {
    this.title = this.breadcrumbService.title
    this.classificationLevel = this.breadcrumbService.classificationLevel
    this.cdr.detectChanges()
  }
}
