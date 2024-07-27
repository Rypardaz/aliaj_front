import { Component, OnInit } from '@angular/core';
import { PasswordFlowService } from 'src/app/app-shell/framework-services/password-flow.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html'
})
export class LogoutComponent implements OnInit {

  constructor(private readonly authenticationService: PasswordFlowService) {
  }

  ngOnInit(): void {
    this.authenticationService.logout();
  }
}