import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Optional, Output, Self } from '@angular/core';

@Component({
  selector: 'custom-control',
  template: ''
})
export class CustomControlComponent implements OnInit, ControlValueAccessor {

  value: any
  ngControl: any

  @Input() identity: string
  @Input() isDisabled: boolean
  @Input() required = false
  @Input() label: string
  @Input() min: number
  @Input() max: number
  @Input() placeholder: string = ''
  @Input() size: 'col-1' | 'col-2' | 'col-3' | 'col-4' | 'col-5' | 'col-6' | 'col-7' | 'col-8' | 'col-9' | 'col-10' | 'col-11' | 'col-12' = 'col-4'
  @Output() changed = new EventEmitter<any>()

  constructor(@Self() @Optional() ngControl: NgControl) {
    if (ngControl) {
      this.ngControl = ngControl
      ngControl.valueAccessor = this
    }
  }

  ngOnInit() {
    if (!this.identity) {
      throw new Error(`لطفا برای '${this.label}' آی دی مشخص کنید.`)
    }
  }

  writeValue(value): void {
    this.value = value
  }

  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }

  // setDisabledState?(isDisabled: boolean): void {
  //   this.isDisabled = isDisabled
  // }

  valueChanged($event) {
    this.value = $event.target.value
    this.onChange(this.value)
    this.changed.emit($event)
  }

  onChange(value) {
  }

  onTouched() {
  }
}
