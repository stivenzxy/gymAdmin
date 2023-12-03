import { Component } from '@angular/core';
import { ReportService } from 'src/shared/services/report.service';
import { PenalizarComponent } from '../penalizar/penalizar.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {

  constructor(private reporteService : ReportService, private dialog : MatDialog){}

  descargar() {
    this.reporteService.descargarReporte().subscribe(data => {
      const url = window.URL.createObjectURL(data);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'reservas.xlsx';
      anchor.click();
      window.URL.revokeObjectURL(url);
    });
  }

  penalizar() {
    this.openLoginDialog();
  }

  openLoginDialog(): void {
    const dialogRef = this.dialog.open(PenalizarComponent, {
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
