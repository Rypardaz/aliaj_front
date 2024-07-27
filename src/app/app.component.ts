import { Component, OnDestroy, OnInit } from '@angular/core';
import { Task } from './task';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  // providers: [TaskService]
})

export class AppComponent implements OnInit, OnDestroy {

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }
}
