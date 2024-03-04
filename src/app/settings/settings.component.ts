import { Component, Renderer2 } from '@angular/core';
import { ReportService } from 'src/shared/services/report.service';
import { PenalizarComponent } from '../penalizar/penalizar.component';
import { MatDialog } from '@angular/material/dialog';
import { ScheduleComponent } from '../schedule/schedule.component';
import { DownloadReportComponent } from '../download-report/download-report.component';
import { MembsershipComponent } from '../membsership/membsership.component';
import { RegisteredUsersComponent } from '../registered-users/registered-users.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {

  constructor(private reporteService : ReportService, private dialog : MatDialog, private renderer: Renderer2){}

  downloadReport() {
    this.openReportDialog();
  }

  penalize() {
    this.openPenalizeDialog();
  }

  openPenalizeDialog(): void {
    // Deshabilitar el scroll usando Renderer2
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
  
    const dialogRef = this.dialog.open(PenalizarComponent, {
      disableClose: true
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.renderer.setStyle(document.body, 'overflow', '');
    });
  }
  

  changeSchedule() {
    this.openScheduleDialog();
  }

  addMembership(){
    this.openMembershipDialog();
  }

  viewUsers(){
    this.openViewUsersDialog();
  }

  openScheduleDialog(): void {
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
    const dialogRef = this.dialog.open(ScheduleComponent, {
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.renderer.setStyle(document.body, 'overflow', '');
    });
  }

  openReportDialog(): void {
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
    const dialogRef = this.dialog.open(DownloadReportComponent, {
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.renderer.setStyle(document.body, 'overflow', '');
      console.log(`Dialog result: ${result}`);
    });
  }

  openMembershipDialog(): void {
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
    const dialogRef = this.dialog.open(MembsershipComponent, {
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.renderer.setStyle(document.body, 'overflow', '');
      console.log(`Dialog result: ${result}`);
    });
  }

  openViewUsersDialog(): void {
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
    const dialogRef = this.dialog.open(RegisteredUsersComponent, {
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.renderer.setStyle(document.body, 'overflow', '');
      console.log(`Dialog result: ${result}`);
    });
  }

}
