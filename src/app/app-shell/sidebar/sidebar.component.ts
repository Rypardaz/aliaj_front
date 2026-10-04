import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLinkActive, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { SalonService } from '../basic-info/salon/salon.service';
import { LocalStorageService } from '../framework-services/local.storage.service';
import { SALON_GUID_NAME } from '../framework-services/configuration';
import { HasPermissionDirective } from '../framework-components/directives/has-permission.directive';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  imports: [HasPermissionDirective, RouterLinkActive, RouterLink]
})
export class SidebarComponent implements OnInit {
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly salonService = inject(SalonService);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly currentUrl = signal(this.router.url.split(/[?#]/)[0]);
  readonly currentSection = computed(() => {
    if (this.currentUrl().startsWith('/dashboard')) return 'dashboard';
    if (this.currentUrl().startsWith('/basic-info/daily-record/')) return 'daily-record-info';
    return null;
  });

  readonly expandedSection = signal<string | null>('dashboard');
  readonly expandedSubmenus = signal(new Set<string>());
  weldingSalons = [];
  productionSalons = [];

  constructor() {
    this.openCurrentSection(this.currentUrl());
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      takeUntilDestroyed()
    ).subscribe(event => {
      const url = event.urlAfterRedirects.split(/[?#]/)[0];
      this.currentUrl.set(url);
      this.openCurrentSection(url);
      if (url !== '/') this.closeMenu();
    });
  }

  ngOnInit(): void {
    this.salonService.getForComboBySalonType(1)
      .subscribe(data => this.productionSalons = data);
    this.salonService.getForComboBySalonType(2)
      .subscribe(data => this.weldingSalons = data);
  }

  toggleSection(section: string): void {
    this.expandedSection.update(current => current === section ? null : section);
  }

  toggleSubmenu(submenu: string): void {
    this.expandedSubmenus.update(current => {
      const next = new Set(current);
      if (next.has(submenu)) next.delete(submenu);
      else next.add(submenu);
      return next;
    });
  }

  isSubmenuOpen(submenu: string): boolean {
    return this.expandedSubmenus().has(submenu);
  }

  onSectionActive(section: string, active: boolean): void {
    if (active) this.expandedSection.set(section);
  }

  onSubmenuActive(submenu: string, active: boolean): void {
    if (active) this.expandedSubmenus.update(current => new Set(current).add(submenu));
  }

  isCurrentRoute(route: string): boolean {
    return this.currentUrl().toLowerCase() === route.toLowerCase();
  }

  closeMenu(): void {
    if (this.document.body.classList.contains('sidebar-enable')) {
      this.document.body.classList.remove('sidebar-enable');
      this.document.getElementById('sidebar-menu-toggle')?.focus();
    }
  }

  private openCurrentSection(url: string): void {
    if (url.startsWith('/dashboard')) this.expandedSection.set('dashboard');
    else if (url.startsWith('/basic-info/daily-record/')) this.expandedSection.set('daily-record-info');
  }

  navigateToForm(guid: string, event: MouseEvent): void {
    this.localStorageService.setItem(SALON_GUID_NAME, guid);
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    // These screens read the salon on initialization and need a fresh instance.
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigateByUrl(`basic-info/daily-record/${guid}`);
    });
  }

  onDashboardClicked(guid: string, event: MouseEvent): void {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    this.localStorageService.setItem(SALON_GUID_NAME, guid);
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigateByUrl(`dashboard/${guid}`);
    });
  }
}
