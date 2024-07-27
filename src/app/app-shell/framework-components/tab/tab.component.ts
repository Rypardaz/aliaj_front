import { TabConfig } from './tab.config';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  AfterViewChecked,
  SimpleChanges,
} from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.css'],
})
export class TabComponent implements AfterViewChecked {
  @Input() public tabConfig: TabConfig;
  @Input() dummyData: number = 0;
  @Output() submited = new EventEmitter<any>();
  @Output() onTabHide = new EventEmitter();
  @Output() myPropChange = new EventEmitter<string>();
  tabId: number = 0;
  constructor() {}
  ngAfterViewChecked(): void {}

  open(id) {
    if(id === 11){
        $(`.tab-div-${id}`).css('transform', 'none');
        $('.app-tab').css('height', '80vh');
    }else{
        $(`.tab-div-${id}`).css('transform', 'none');
        $('.app-tab2').css('height', '83vh');
    }
  }

  submit(action) {
    this.submited.emit(action);
  }

  close(id) {
    $(`.tab-div-${id}`).css('transform', 'revert-layer');
    setTimeout(() => {
        if (id=== 11) {
            $('.app-tab').css('height', '0vh');
        }else{
            $('.app-tab2').css('height', '0vh');
        }
    }, 500);
  }

  ngOnInit(): void {
    this.tabId = this.dummyData
  }
}
