import {
  Component, EventEmitter,
  Input,
  OnInit, Output
} from '@angular/core';
import { createGuid } from '../constants';

@Component({
  selector: 'app-base-button',
  template: ``
})
export class BaseButtonComponent implements OnInit {

  @Input() permission
  @Input() identifier: string
  @Input() className = 'primary'
  @Input() btnType = 'button'
  @Input() disable = false
  @Output() clicked = new EventEmitter()

  constructor() { }

  ngOnInit() {
  }

  onClick() {
    this.clicked.emit()
  }
}
