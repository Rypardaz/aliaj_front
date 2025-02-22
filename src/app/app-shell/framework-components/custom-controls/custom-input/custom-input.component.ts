import { NgControl } from '@angular/forms';
import { CustomControlComponent } from '../custom-control.component';
import { Component, EventEmitter, HostBinding, Input, OnInit, Optional, Output, Self } from '@angular/core';
import { NotificationService } from 'src/app/app-shell/framework-services/notification.service';
declare var $: any;

@Component({
  selector: 'custom-input',
  templateUrl: './custom-input.component.html'
})
export class CustomInputComponent extends CustomControlComponent implements OnInit {

  @HostBinding('class') class: string;
  @Input() customClass: string
  @Input() type: 'text' | 'number' | 'password' | 'email' | 'color' | 'date' | 'file' | 'text-area' = 'text'
  @Output() keyupEnter = new EventEmitter();

  constructor(@Self() @Optional() ngControl: NgControl) {
    super(ngControl)
  }

  override ngOnInit() {
    super.ngOnInit()
    this.class = this.size
  }

  keyup(type: string): void {
    switch (type) {
      case 'enter':
        this.keyupEnter.emit()
        break;

      default:
        break;
    }
  }
}