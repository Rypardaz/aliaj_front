import { Component, OnDestroy, OnInit } from '@angular/core';
import { Task } from './task';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    imports: [RouterOutlet]
})

export class AppComponent implements OnInit, OnDestroy {

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }
}
