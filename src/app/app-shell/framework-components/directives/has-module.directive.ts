import {
  Directive,
  OnInit,
  TemplateRef,
  ViewContainerRef,
  Input
} from '@angular/core';
import { PasswordFlowService } from '../../framework-services/password-flow.service';

@Directive({
  selector: '[hasModule]'
})
export class HasModuleDirective implements OnInit {
  private neededModule;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authenticationService: PasswordFlowService) {
  }

  ngOnInit() { }

  @Input()
  set hasPermission(val) {
    this.neededModule = val;
    this.updateView();
  }

  private updateView() {
    if (true) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}