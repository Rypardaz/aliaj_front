import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { datePickerConfig } from '../constants'
import { DateMaskDirective } from '../directives/date-mask.directive';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-select-date',
    templateUrl: './select-date.component.html',
    imports: [FormsModule, DateMaskDirective, NgClass]
})
export class SelectDateComponent implements OnInit {

  fromDate
  toDate
  datePickerConfig = datePickerConfig

  @Input() id
  @Input() type
  @Output() submited: EventEmitter<any> = new EventEmitter()

  constructor() { }

  ngOnInit() {
  }

  submit() {
    this.submited.emit({ fromDate: this.fromDate, toDate: this.toDate })
  }
}
