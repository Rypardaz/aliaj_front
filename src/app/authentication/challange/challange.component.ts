import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CodeFlowService } from 'src/app/app-shell/framework-services/code-flow.service';
import { USER_ID_NAME, ROLE_TOKEN_NAME, PERMISSIONS_NAME, ACCESS_TOKEN_NAME } from 'src/app/app-shell/framework-services/configuration';
import { IdentityService } from 'src/app/app-shell/framework-services/identity.service';
import { LocalStorageService } from 'src/app/app-shell/framework-services/local.storage.service';
import { FeatureService } from 'src/app/app-shell/user-management/services/feature.service';

@Component({
  selector: 'app-challange',
  templateUrl: './challange.component.html',
})
export class ChallangeComponent implements OnInit {

  constructor(
    private readonly router: Router,
    private readonly codeFlowService: CodeFlowService,
    private readonly identityService: IdentityService,
    private readonly localStorageService: LocalStorageService,
    private readonly featureService: FeatureService) { }

  ngOnInit() {
    this.codeFlowService
      .completeAuthentication()
      .then(_ => {
        this.localStorageService.setItem(USER_ID_NAME, this.codeFlowService.user.profile['id'])
        this.localStorageService.setItem(ROLE_TOKEN_NAME, this.codeFlowService.user.profile['role'])
        this.localStorageService.setItem(ACCESS_TOKEN_NAME, this.codeFlowService.user.access_token)
        this.getFeatures()
      })
  }

  getFeatures() {
    this.featureService
      .getUserPermissions()
      .subscribe({
        next: permissions => {
          this.localStorageService.setItem(PERMISSIONS_NAME, permissions)

          this.router.navigateByUrl('dashboard')

          // this.settingService.getSystemAndUserSettings().subscribe(settings => {
          //   this.localStorageService.setItem(SETTINGS_NAME, JSON.stringify(settings))
          //   this.userService
          //     .getUserBranches()
          //     .subscribe(userBranches => {
          //       const useBranch = this.settingService.getSettingValue("UseBranch") == "1"
          //       if (useBranch && userBranches.length == 0) {
          //         this.notificationService.failed("هیچ شعبه ای برای شما فعال نیست.")
          //         return
          //       }
          //       this.identityService.GetCurrentYearBranchInvId().subscribe(data => {
          //         this.localStorageService.setItem(CURRENT_YEAR_ID_NAME, data.yearId)
          //         let branchId = data.branchId
          //         if (useBranch) {
          //           branchId = null
          //         }
          //         this.localStorageService.setItem(CURRENT_Branch_ID_NAME, branchId)
          //         this.localStorageService.setItem(CURRENT_Inv_ID_NAME, data.invId)
          //         this.navigateToDashboard()
          //       })
          //     })
          // })
        },
        error: () => this.codeFlowService.logout(),
      })
  }
}
