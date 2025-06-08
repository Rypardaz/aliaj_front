import { AfterViewInit, Component, OnInit } from '@angular/core'
import { SalonService } from '../basic-info/salon/salon.service';
import { ComboBase } from '../framework-components/combo-base';
import { Router } from '@angular/router';
import { LocalStorageService } from '../framework-services/local.storage.service';
import { SALON_GUID_NAME } from '../framework-services/configuration';
import { ListItemService } from '../basic-info/list-item/list-item.service';
declare var $: any

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit, AfterViewInit {

  salonTypes = []
  weldingSalons = []
  productionSalons = []

  constructor(
    private readonly router: Router,
    private readonly salonService: SalonService,
    private readonly listItemService: ListItemService,
    private readonly localStorageService: LocalStorageService) {
  }

  ngOnInit(): void {
    this.salonService
      .getForComboBySalonType(1)
      .subscribe(data => this.productionSalons = data)

    this.salonService
      .getForComboBySalonType(2)
      .subscribe(data => this.weldingSalons = data)

    this.listItemService
      .getForCombo("14")
      .subscribe((data: any) => {
        this.salonTypes = data
      })
  }

  ngAfterViewInit(): void {
    var twoColSideNav = $("#two-col-sidenav-main");
    if (twoColSideNav.length) {
      var twoColSideNavItems = $("#two-col-sidenav-main .nav-link");
      var sideSubMenus = $(".twocolumn-menu-item");

      var nav = $('.twocolumn-menu-item .nav-second-level');
      var navCollapse = $('#two-col-menu li .collapse');

      // open one menu at a time only
      navCollapse.on({
        'show.bs.collapse': function () {
          var nearestNav = $(this).closest(nav).closest(nav).find(navCollapse);
          if (nearestNav.length)
            nearestNav.not($(this)).collapse('hide');
          else
            navCollapse.not($(this)).collapse('hide');
        }
      });

      twoColSideNavItems.on('click', function (e) {
        var target = $($(this).attr('href'));

        if (target.length) {
          e.preventDefault();

          twoColSideNavItems.removeClass('active');
          $(this).addClass('active');

          sideSubMenus.removeClass("d-block");
          target.addClass("d-block");

          // showing full sidebar if menu item is clicked
          // $.LayoutThemeApp.leftSidebar.changeSize('default');
          return false;
        }
        return true;
      });

      // activate menu with no child
      var pageUrl = window.location.href.split(/[?#]/)[0];
      twoColSideNavItems.each(function () {
        if (this.href == pageUrl) {
          $(this).addClass('active');
        }
      });

      // activate the menu in left side bar (Two column) based on url
      $("#two-col-menu a").each(function () {
        if (this.href == pageUrl) {
          $(this).addClass("active");
          $(this).parent().addClass("menuitem-active");
          $(this).parent().parent().parent().addClass("show");
          $(this).parent().parent().parent().parent().addClass("menuitem-active"); // add active to li of the current link

          var firstLevelParent = $(this).parent().parent().parent().parent().parent().parent();
          if (firstLevelParent.attr('id') !== 'sidebar-menu')
            firstLevelParent.addClass("show");

          $(this).parent().parent().parent().parent().parent().parent().parent().addClass("menuitem-active");

          var secondLevelParent = $(this).parent().parent().parent().parent().parent().parent().parent().parent().parent();
          if (secondLevelParent.attr('id') !== 'wrapper')
            secondLevelParent.addClass("show");

          var upperLevelParent = $(this).parent().parent().parent().parent().parent().parent().parent().parent().parent().parent();
          if (!upperLevelParent.is('body'))
            upperLevelParent.addClass("menuitem-active");

          // opening menu
          var matchingItem = null;
          var targetEl = '#' + $(this).parents('.twocolumn-menu-item').attr("id");
          $("#two-col-sidenav-main .nav-link").each(function () {
            if ($(this).attr('href') === targetEl) {
              matchingItem = $(this);
            }
          });
          if (matchingItem) matchingItem.trigger('click');
        }
      });
    }
  }

  navigateToForm(guid) {
    this.localStorageService.setItem(SALON_GUID_NAME, guid)
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigateByUrl(`basic-info/daily-record/${this.localStorageService.getItem(SALON_GUID_NAME)}`)
    })
  }

  onDashboardClicked(guid) {
    this.localStorageService.setItem(SALON_GUID_NAME, guid)
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigateByUrl(`dashboard/${guid}`)
    })
  }
}