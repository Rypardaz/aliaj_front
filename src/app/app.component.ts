import { RouterOutlet } from '@angular/router'
import { LicenseManager } from 'ag-grid-enterprise'
import { Component, OnDestroy, OnInit } from '@angular/core'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [RouterOutlet]
})

export class AppComponent implements OnInit, OnDestroy {

  ngOnInit(): void {
    // LicenseManager.setLicenseKey('MjAwMDAwMDAwMDAwMA==5a5ea3be8a8aaa9b54ce7186663066431')

    LicenseManager.setLicenseKey("DownloadDevTools_COM_NDEwMjM0NTgwMDAwMA==59158b5225400879a12a96634544f5b6")

  }

  ngOnDestroy(): void {
  }
}
