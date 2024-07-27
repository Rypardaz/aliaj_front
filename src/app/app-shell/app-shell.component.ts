import { Component, HostListener, OnInit } from '@angular/core';
import { PasswordFlowService } from './framework-services/password-flow.service';

@Component({
  selector: 'app-app-shell',
  templateUrl: './app-shell.component.html'
})
export class AppShellComponent implements OnInit {

  constructor(private readonly authenticationService: PasswordFlowService) { }

  ngOnInit() {
  }
}