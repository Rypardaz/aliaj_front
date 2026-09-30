import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input, forwardRef } from '@angular/core'
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms'
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'custom-ng-select',
  templateUrl: './custom-ng-select.component.html',
  styleUrls: ['./custom-ng-select.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomNgSelectComponent),
      multi: true,
    },
  ],
  imports: [NgSelectModule, FormsModule]
})
export class CustomNgSelectComponent implements ControlValueAccessor {

  @HostBinding('class') class: string;
  @Input() placeholder: string = ''
  @Input() required = false
  @Input() multiple = false
  @Input() label: string = ''
  @Input() identity: string
  @Input() options: any[] = []

  value: any

  onChange = (value: any) => { }
  onTouched = () => { }

  // write value from parent form
  writeValue(value: any): void {
    this.value = value
  }

  // register onChange callback
  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  // register onTouched callback
  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }

  onValueChange(val: any): void {
    this.value = val
    this.onChange(val)
  }

  // optional (for disable state)
  setDisabledState(isDisabled: boolean): void {
    // handle disable if needed
  }
}
