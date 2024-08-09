import { Component, OnInit, Renderer2 } from '@angular/core';
import { PenalizeComponent } from '../penalize/penalize.component';
import { MatDialog } from '@angular/material/dialog';
import { ScheduleComponent } from '../schedule/schedule.component';
import { DownloadReportComponent } from '../download-report/download-report.component';
import { MembsershipComponent } from '../membsership/membsership.component';
import { RegisteredUsersComponent } from '../registered-users/registered-users.component';
import { LoginService } from 'src/shared/services/login.service';
import { ChangePasswordComponent } from '../change-password/change-password.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    private renderer: Renderer2,
    private loginService: LoginService
  ) {}

  isAdminLoggedIn: boolean = false;
  isUserLoggedIn: boolean = false;

  ngOnInit(): void {
    this.checkAuthStatus();
  }

  checkAuthStatus(): void {
    this.isAdminLoggedIn = this.loginService.isAdminLoggedIn();
    this.isUserLoggedIn = this.loginService.isUserLoggedIn();
  }

  downloadReport() {
    this.openReportDialog();
  }

  penalize() {
    this.openPenalizeDialog();
  }

  openPenalizeDialog(): void {
    this.renderer.setStyle(document.body, 'overflow', 'hidden');

    const dialogRef = this.dialog.open(PenalizeComponent, {
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      this.renderer.setStyle(document.body, 'overflow', '');
    });
  }

  changeSchedule() {
    this.openScheduleDialog();
  }

  addMembership() {
    this.openMembershipDialog();
  }

  viewUsers() {
    this.openViewUsersDialog();
  }

  openScheduleDialog(): void {
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
    const dialogRef = this.dialog.open(ScheduleComponent, {
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      this.renderer.setStyle(document.body, 'overflow', '');
    });
  }

  openReportDialog(): void {
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
    const dialogRef = this.dialog.open(DownloadReportComponent, {
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.renderer.setStyle(document.body, 'overflow', '');
      console.log(`Dialog result: ${result}`);
    });
  }

  openMembershipDialog(): void {
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
    const dialogRef = this.dialog.open(MembsershipComponent, {
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.renderer.setStyle(document.body, 'overflow', '');
      console.log(`Dialog result: ${result}`);
    });
  }

  openViewUsersDialog(): void {
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
    const dialogRef = this.dialog.open(RegisteredUsersComponent, {
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.renderer.setStyle(document.body, 'overflow', '');
      console.log(`Dialog result: ${result}`);
    });
  }

  openNewPasswordDialog(): void {
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
    const dialogRef = this.dialog.open(ChangePasswordComponent, {
      width: '450px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.renderer.setStyle(document.body, 'overflow', '');
      console.log(`Dialog result: ${result}`);
    });
  }
}
