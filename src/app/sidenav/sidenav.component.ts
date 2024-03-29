import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { navbarData } from './nav-data';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { INavbarData } from './helper';
import { LoginAdminService } from 'src/shared/services/login-admin.service';
import { AuthService } from 'src/shared/services/auth.service';

interface SideNavToogle {
  screenWidth: number;
  collapsed: boolean
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({opacity: 0}),
        animate('350ms',
          style({opacity: 1})
        )
      ]),
      transition(':leave', [
        style({opacity: 1}),
        animate('0ms',
          style({opacity: 0})
        )
      ])
    ]),
    trigger('rotate', [
      transition(':enter', [
        animate('700ms',
          keyframes([
            style({transform: 'rotate(0deg)', offset: '0'}),
            style({transform: 'rotate(1turn)', offset: '1'})
          ])
        )
      ])
    ])
  ]
})
export class SidenavComponent implements OnInit {

  @Output() onToggleSideNav: EventEmitter<SideNavToogle> = new EventEmitter();
  collapsed = false;
  screenWidth = 0;
  navData = navbarData;
  isAdminLoggedIn: boolean = false;
  isUserLoggedIn: boolean = false;

  @ViewChild('sidenavContainer') sidenavContainer!: ElementRef;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
          this.closeAllSubMenu();
  }

  constructor(private authService : AuthService, private adminService : LoginAdminService){}

  closeAllSubMenus(): void {
    this.navData.forEach(navItem => navItem.expanded = false);
  }

  @HostListener('window:resize', ['$event']) // Escucha eventos del DOM
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if(this.screenWidth <= 768) {
      this.collapsed = false;
      this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
    }
  }

  ngOnInit(): void {
      this.screenWidth = window.innerWidth;
      this.isAdminLoggedIn = this.adminService.isLoggedIn();
      this.isUserLoggedIn = this.authService.isLoggedIn;

      this.navData = [...navbarData];

      this.authService.user.subscribe(user => {
        if (user) {
          // Filtrar el ítem 'settings' si el usuario está logueado
          this.navData = navbarData.filter(item => item.routeLink !== 'settings');
        } else {
          // Restaurar el arreglo original si no hay usuario logueado
          this.navData = [...navbarData];
        }
      });
  }

  toggleCollapse() : void {
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
  }

  closeSidenav() : void {
    this.collapsed = false;
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
  }

  toggleSubMenu(event: MouseEvent, data: INavbarData): void {
    event.stopPropagation(); //evita la propagacion del evento en la funcion closeAllSubMenus
    const wasExpanded = data.expanded;
    this.closeAllSubMenus();
    if (data.items && !wasExpanded) {
        data.expanded = true;
    }
  }

  closeAllSubMenu() : void {
    this.navData.forEach(item => {
      if (item.items) {
          item.expanded = false;
      }
    });
  }
  
}
