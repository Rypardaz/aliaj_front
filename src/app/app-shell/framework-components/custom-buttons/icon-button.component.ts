import {
  Component, EventEmitter,
  Input,
  OnInit, Output
} from '@angular/core';
import { BaseButtonComponent } from './base-button.component';

@Component({
  selector: 'app-icon-button',
  template: `
    <button [id]="identifier" [type]="btnType" className="btn btn-{{className}} waves-effect waves-light" [title]="label" (click)="onClick()" [disabled]="disable">
      <i [class]="icon"></i>
    </button>
  `
})
export class IconButtonComponent extends BaseButtonComponent implements OnInit {
  @Input() label = 'dafault'
  @Input() icon = ''
}
