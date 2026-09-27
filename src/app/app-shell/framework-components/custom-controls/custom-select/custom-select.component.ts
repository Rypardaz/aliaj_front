import { NgControl, FormsModule } from '@angular/forms';
import { AfterContentInit, AfterViewChecked, Component, EventEmitter, HostBinding, Input, OnInit, Optional, Output, Self } from '@angular/core';
import { CustomControlComponent } from '../custom-control.component';
import { SettingService } from 'src/app/app-shell/framework-services/setting.service';
import { Select2Directive } from '../../directives/select2.directive';

declare var $: any;

@Component({
    selector: 'custom-select',
    templateUrl: './custom-select.component.html',
    imports: [Select2Directive, FormsModule]
})
export class CustomSelectComponent extends CustomControlComponent implements OnInit, AfterContentInit {

  // minumumInputLength = this.settingService.getSettingValue("MinimumInputLength")

  @HostBinding('class') class: string
  @Input() type: 'select' | 'select-ajax' = 'select'
  @Input() options: any[] = []
  @Input() ajaxUrl: string
  @Input() searchTerm: string
  @Input() selectedItem: { id: string, name: string }

  @Output() selected = new EventEmitter()

  constructor(
    private readonly settingService: SettingService,
    @Self() @Optional() ngControl: NgControl) {
    super(ngControl)
  }

  override ngOnInit() {
    super.ngOnInit()
    this.class = this.size
  }

  ngAfterContentInit(): void {
    $('select').trigger('change')
  }

  itemSeleceted() {

    this.selected.emit()
  }
}