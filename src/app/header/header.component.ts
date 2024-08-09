import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GoogleAuthService } from 'src/shared/services/googleAuth.service';
import { LoginComponent } from '../login/login.component';
import { redirectLogin, themes, userItems } from './header-dummy-data';
import { AboutComponent } from '../about/about.component';
import { LoginService } from 'src/shared/services/login.service';
import { UserData } from 'src/shared/models/entities/userData';
import { GoogleAuthData } from 'src/shared/models/entities/googleAuthData';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() collapsed = false;
  @Input() screenWidth = 0;
  private destroy$ = new Subject<void>();

  preRegisterUserData: GoogleAuthData | undefined;
  loggedUserData!: UserData;
  userSubscription!: Subscription;
  loginDialogRef: MatDialogRef<LoginComponent> | null = null;
  userInRegisterSubs!: Subscription;
  loggedUserSubs!: Subscription;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    public dialog: MatDialog,
    private preRegisterService: GoogleAuthService,
    private loginService: LoginService,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
  ) {
    this.preRegisterService.onLogout
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.openLoginDialog();
      });
  }

  canShowSearchAsOverlay = false;
  selectedTheme: any;

  themes = themes;
  userItems = userItems;
  loginItem = redirectLogin;

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

    // Register section info
    this.userSubscription = this.preRegisterService.user.subscribe(
      (googleUserData) => {
        this.preRegisterUserData = googleUserData;
        this.cdr.detectChanges(); // garantiza que se detecten y apliquen los cambios que no son inmediatos
      }
    );

    // Register section status (for specific actions)
    this.userInRegisterSubs = this.preRegisterService.loginObservable.subscribe(
      (loggedIn) => {
        if (loggedIn && this.loginDialogRef) {
          this.loginDialogRef.close();
        }
      }
    );

    // Logged User info
    this.loggedUserSubs = this.loginService
      .getLoggedUserData()
      .subscribe((userData) => {
        if (userData) {
          this.loggedUserData = userData;
        }
      });

    console.log(this.loggedUserData);
  }

  onImageLoad() {
    console.log('Imagen de Google cargada con éxito!');
  }

  getHeadClass(): string {
    let styleClass = '';
    if (this.collapsed && this.screenWidth > 768) {
      styleClass = 'head-trimmed';
    } else {
      styleClass = 'head-md-screen';
    }
    return styleClass;
  }

  selectOptionProfile(itemProfile: any): void {
    if (itemProfile.action === 'logout') {
      if (this.loggedUser === true || this.loggedAdmin === true) {
        console.log('logged Exit!');
        this.loginService.logOut();
      } else {
        console.log('preRegister Exit!');
        this.preRegisterService.logOut();
      }
    }
  }

  toggleTheme(): void {
    if (this.selectedTheme.class === 'dark-theme') {
      this.selectedTheme = this.themes.find(
        (theme) => theme.class !== 'dark-theme'
      );
      this.document.body.classList.remove('dark-mode');
    } else {
      this.selectedTheme = this.themes.find(
        (theme) => theme.class === 'dark-theme'
      );
      this.document.body.classList.add('dark-mode');
    }

    localStorage.setItem('selectedTheme', JSON.stringify(this.selectedTheme));
  }

  selectSignInOptions(logItem: any) {
    if (logItem.action === 'login') {
      this.openLoginDialog();
    }

    if (logItem.action === 'about') {
      this.openAboutDialog();
    }
  }

  openLoginDialog() {
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
    this.loginDialogRef = this.dialog.open(LoginComponent, {
      disableClose: true,
    });

    this.loginDialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      this.loginDialogRef = null;
      this.renderer.setStyle(document.body, 'overflow', '');
    });
  }

  openAboutDialog() {
    const dialogRef = this.dialog.open(AboutComponent, {
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  get loggedAdmin(): boolean {
    return this.loginService.isAdminLoggedIn();
  }

  get loggedUser(): boolean {
    return this.loginService.isUserLoggedIn();
  }

  get isUserInRegister(): boolean {
    return this.preRegisterService.isGoogleInfoAvaliable();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.userSubscription.unsubscribe();

    if (this.userInRegisterSubs) {
      this.userInRegisterSubs.unsubscribe();
    }
  }
}
