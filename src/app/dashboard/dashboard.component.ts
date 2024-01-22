import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { Subscription } from 'rxjs';
import { LoginAdminService } from 'src/shared/services/login-admin.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy{

  userData: any;
  userSubscription!: Subscription;
  adminUsername!: string;

  constructor(private authService: AuthService, private adminService: LoginAdminService) { }

  ngOnInit(): void {
    this.userSubscription = this.authService.user.subscribe(user => {
      this.userData = user;
    });

    const adminData = this.adminService.getUserData();
    if(adminData) {
      this.adminUsername = adminData.username;
    }
    
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  ngOnDestroy(): void {
      this.userSubscription.unsubscribe();
  }

  get loggedAdmin() : boolean {
    return this.adminService.isLoggedIn();
  }

  getDisplayName(): string {
    return this.userData?.displayName ?? '';
  }

  getAdminName(): string {
    return this.adminUsername ?? '';
  }

}
