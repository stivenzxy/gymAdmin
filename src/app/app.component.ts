import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { GoogleAuthService } from 'src/shared/services/googleAuth.service';
import { InactivityService } from 'src/shared/services/inactivity.service';
import Swal from 'sweetalert2';

interface SideNavToogle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isSideNavCollapsed = false;
  screenWidth = 0;
  isLoading: boolean = true;

  onToggleSideNav(data: SideNavToogle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }

  constructor(
    private preRegisterService: GoogleAuthService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.preRegisterService.loading.subscribe((isLoading) => {
      this.isLoading = isLoading;
      if (!isLoading) {
        setTimeout(() => {
          this.isLoading = false;
        }, 1000);
      }
      this.cdRef.detectChanges();
    });

    this.verifyCanceledRegister();
  }

  verifyCanceledRegister() {
    const registerStatus = JSON.parse(
      localStorage.getItem('register') || 'false'
    );

    if (registerStatus) {
      Swal.fire({
        title: 'Upss..!, Te has tardado mucho',
        icon: 'info',
        text: 'El tiempo para finalizar el registro ha expirado, por tu seguridad completa el registro tan pronto accedas a tu cuenta de Google',
        confirmButtonText: 'Entendido',
        showCancelButton: false,
      }).then(() => {
        localStorage.removeItem('register');
        this.preRegisterService.logoutSubject.next();
      });
    }
  }
}
