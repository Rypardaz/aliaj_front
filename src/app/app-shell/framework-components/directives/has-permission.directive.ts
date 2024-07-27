import { Directive, OnInit, TemplateRef, ViewContainerRef, Input } from '@angular/core';
import { AuthorizationService } from '../../framework-services/authorization.service';

@Directive({
  selector: '[hasPermission]'
})
export class HasPermissionDirective implements OnInit {
  private neededPermission: string;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authorizationService: AuthorizationService) {
  }

  ngOnInit() { }

  @Input()
  set hasPermission(val) {
    this.neededPermission = val;
    this.updateView();
  }

  private updateView() {
    if (this.authorizationService.hasNoAnyPermissions()) this.viewContainer.clear;
    if (this.authorizationService.checkPermission(this.neededPermission)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}