import { Component } from '@angular/core';
import { ReportService } from 'src/shared/services/report.service';
import { PenalizarComponent } from '../penalizar/penalizar.component';
import { MatDialog } from '@angular/material/dialog';
import { ScheduleComponent } from '../schedule/schedule.component';
import { DownloadReportComponent } from '../download-report/download-report.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {

  constructor(private reporteService : ReportService, private dialog : MatDialog){}

  downloadReport() {
    this.openReportDialog();
  }

  penalize() {
    this.openPenalizeDialog();
  }

  openPenalizeDialog(): void {
    const dialogRef = this.dialog.open(PenalizarComponent, {
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  changeSchedule() {
    this.openScheduleDialog();
  }

  openScheduleDialog(): void {
    const dialogRef = this.dialog.open(ScheduleComponent, {
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openReportDialog(): void {
    const dialogRef = this.dialog.open(DownloadReportComponent, {
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
