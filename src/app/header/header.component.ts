import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/shared/services/auth.service';
import { LoginComponent } from '../login/login.component';
import { notifications, redirectLogin, themes, userItems } from './header-dummy-data';
import { LoginAdminService } from 'src/shared/services/login-admin.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy{
  @Input() collapsed = false;
  @Input() screenWidth = 0;
  private destroy$ = new Subject<void>();

  // datos del usuario
  adminLogueado: boolean = false;
  userData: any;
  userSubscription!: Subscription;

  constructor(@Inject(DOCUMENT) private document :Document, private router: Router, public dialog: MatDialog,
   private authService: AuthService, private adminService: LoginAdminService) {
    this.authService.onLogout.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.openLoginDialog();
    });
  }

  canShowSearchAsOverlay = false; 
  selectedTheme: any;
  //isLoggedIn:boolean = false;

  themes = themes;
  notifications = notifications;
  userItems = userItems;
  loginItem = redirectLogin;

  //@HostListener('window:resize', ['$event']) // Escucha eventos del DOM

  ngOnInit(): void { 
    const savedTheme = localStorage.getItem('selectedTheme');

    if (savedTheme) {
        this.selectedTheme = JSON.parse(savedTheme);

        if (this.selectedTheme.class === 'dark-theme') {
            this.document.body.classList.add('dark-mode');
        } else {
            this.document.body.classList.remove('dark-mode');
        }
    } else {
        this.selectedTheme = this.themes[0];
    }

    this.userSubscription = this.authService.user.subscribe(user => {
      this.userData = user;
    });

    this.adminLogueado = this.adminService.isLoggedIn();
  }
  

  getHeadClass() : string {
    let styleClass = '';
    if(this.collapsed && this.screenWidth > 768) {
      styleClass = 'head-trimmed';
    } else {
      styleClass = 'head-md-screen';
    }
    return styleClass;
  }

  selectOptionProfile(itemProfile: any) : void {
    if(itemProfile.action === 'logout') {
      this.authService.logOut();
      this.adminService.logout();
    }
  }

  toggleTheme(): void {
    if (this.selectedTheme.class === 'dark-theme') {
      this.selectedTheme = this.themes.find(theme => theme.class !== 'dark-theme'); 
      this.document.body.classList.remove('dark-mode');
    } else {
      this.selectedTheme = this.themes.find(theme => theme.class === 'dark-theme');
      this.document.body.classList.add('dark-mode');
    }
  
    // Guardar en LocalStorage el tema seleccionado
    localStorage.setItem('selectedTheme', JSON.stringify(this.selectedTheme));
  }

  openLoginDialog() {
    const dialogRef = this.dialog.open(LoginComponent, {
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  get loggedAdmin() : boolean {
    return this.adminService.isLoggedIn();
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.userSubscription.unsubscribe();
  }
}

