import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { navbarData } from './nav-data';
import {
  animate,
  keyframes,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { INavbarData } from './helper';
import { GoogleAuthService } from 'src/shared/services/googleAuth.service';
import { LoginService } from 'src/shared/services/login.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

interface SideNavToogle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('350ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('0ms', style({ opacity: 0 })),
      ]),
    ]),
    trigger('rotate', [
      transition(':enter', [
        animate(
          '700ms',
          keyframes([
            style({ transform: 'rotate(0deg)', offset: '0' }),
            style({ transform: 'rotate(1turn)', offset: '1' }),
          ])
        ),
      ]),
    ]),
  ],
})
export class SidenavComponent implements OnInit, OnDestroy {
  @Output() onToggleSideNav: EventEmitter<SideNavToogle> = new EventEmitter();
  collapsed = false;
  screenWidth = 0;
  navData = navbarData;
  isAdminLoggedIn: boolean = false;
  isUserLoggedIn: boolean = false;
  isUserInRegister: boolean = false;

  private intervalId!: number;
  private subscriptions: Subscription[] = [];

  @ViewChild('sidenavContainer') sidenavContainer!: ElementRef;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    this.closeAllSubMenu();
  }

  constructor(
    private preRegisterService: GoogleAuthService,
    private loginService: LoginService,
    private cdRef: ChangeDetectorRef,
    private router: Router
  ) {}

  closeAllSubMenus(): void {
    this.navData.forEach((navItem) => (navItem.expanded = false));
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 768) {
      this.collapsed = false;
      this.onToggleSideNav.emit({
        collapsed: this.collapsed,
        screenWidth: this.screenWidth,
      });
    }
  }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    // Initial state check
    this.checkAuthStatus();

    // Set interval to check status every second
    this.intervalId = window.setInterval(() => {
      this.checkAuthStatus();
    }, 1000);

    // Subscribe to user status from PreRegisterService
    const preRegisterSubscription = this.preRegisterService.user.subscribe(
      (user) => {
        this.isUserInRegister = !!user;
        this.updateNavData();
      }
    );

    this.subscriptions.push(preRegisterSubscription);
  }

  checkAuthStatus(): void {
    this.isAdminLoggedIn = this.loginService.isAdminLoggedIn();
    this.isUserLoggedIn = this.loginService.isUserLoggedIn();
    this.updateNavData();
  }

  updateNavData(): void {
    if (this.isUserLoggedIn || this.isUserInRegister) {
      this.navData = navbarData.filter((item) => item.routeLink !== 'settings');
    } else {
      this.navData = [...navbarData];
    }
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({
      collapsed: this.collapsed,
      screenWidth: this.screenWidth,
    });
  }

  closeSidenav(): void {
    this.collapsed = false;
    this.onToggleSideNav.emit({
      collapsed: this.collapsed,
      screenWidth: this.screenWidth,
    });
  }

  toggleSubMenu(event: MouseEvent, data: INavbarData): void {
    event.stopPropagation(); // prevent propagation of the event in the closeAllSubMenus function
    const wasExpanded = data.expanded;
    this.closeAllSubMenus();
    if (data.items && !wasExpanded) {
      data.expanded = true;
    }
  }

  closeAllSubMenu(): void {
    this.navData.forEach((item) => {
      if (item.items) {
        item.expanded = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
