import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-basic-info',
    templateUrl: './basic-info.component.html',
    imports: [RouterOutlet]
})
export class BasicInfoComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
