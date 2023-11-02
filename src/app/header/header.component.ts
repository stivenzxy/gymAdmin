import { Component, HostListener, Input, OnInit, Inject } from '@angular/core';
import { themes, notifications, userItems, redirectLogin } from './header-dummy-data';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{
  @Input() collapsed = false;
  @Input() screenWidth = 0;

  constructor(@Inject(DOCUMENT) private document :Document, private router: Router, public dialog: MatDialog) {}

  canShowSearchAsOverlay = false; 
  selectedTheme: any;
  isLoggedIn:boolean = false;

  themes = themes;
  notifications = notifications;
  userItems = userItems;
  loginItem = redirectLogin;

  @HostListener('window:resize', ['$event']) // Escucha eventos del DOM

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

  changeTheme(theme: any): void {
    this.selectedTheme = theme;

    if (theme.class === 'dark-theme') {
      this.document.body.classList.add('dark-mode');
      //alert('modo oscuro eleccionado');
    } else {
      this.document.body.classList.remove('dark-mode');
      //alert('modo claro seleccionado');
    }
    // guardar en LocalStorage el tema seleccionado
    localStorage.setItem('selectedTheme', JSON.stringify(theme));
    console.log(theme.class)
  }

  openLoginDialog() {
    const dialogRef = this.dialog.open(LoginComponent, {
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}

