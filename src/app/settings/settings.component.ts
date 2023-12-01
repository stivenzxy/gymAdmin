import { Component } from '@angular/core';
import { ReportService } from 'src/shared/services/report.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {

  constructor(private reporteService : ReportService){}

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
}
