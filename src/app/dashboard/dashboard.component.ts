import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy{

  userData: any;
  userSubscription!: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.userSubscription = this.authService.user.subscribe(user => {
      this.userData = user;
    });
    
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  ngOnDestroy(): void {
      this.userSubscription.unsubscribe();
  }

  getDisplayName(): string {
    return this.userData?.displayName ?? '';
  }
}
