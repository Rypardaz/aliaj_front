import { Component, OnInit } from '@angular/core';
import { PasswordFlowService } from './framework-services/password-flow.service';
import { RouterOutlet } from '@angular/router';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';

@Component({
    selector: 'app-app-shell',
    templateUrl: './app-shell.component.html',
    imports: [HeaderComponent, SidebarComponent, BreadcrumbComponent, RouterOutlet]
})
export class AppShellComponent implements OnInit {

  constructor(private readonly authenticationService: PasswordFlowService) { }

  ngOnInit() {
  }
}