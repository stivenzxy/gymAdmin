import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/shared/services/report.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-download-report',
  templateUrl: './download-report.component.html',
  styleUrls: ['./download-report.component.scss']
})
export class DownloadReportComponent implements OnInit {
  excelData!: any[];
  fileData!: Blob;
  dataAvailable: boolean = false;

  constructor(private reporteService: ReportService) { }

  ngOnInit() {
    this.loadExcelFile();
  }

  loadExcelFile() {
    this.reporteService.descargarReporte().subscribe(data => {
      this.fileData = data;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const bstr: string = e.target.result;
        const workbook = XLSX.read(bstr, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        this.excelData = XLSX.utils.sheet_to_json(worksheet);
        this.dataAvailable = this.excelData && this.excelData.length > 0;
      };
      reader.readAsBinaryString(data);
      
    });
  }

  downloadFile() {
    const fechaActual = new Date();
    const fecha = fechaActual.toISOString().split('T')[0];

    const url = window.URL.createObjectURL(this.fileData);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `asistencias_${fecha}.xlsx`;
    anchor.click();
    window.URL.revokeObjectURL(url);
  }


  // función original para descargar el reporte
  /*downloadReport() {
    this.reporteService.descargarReporte().subscribe(data => {
      const url = window.URL.createObjectURL(data);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'reservas.xlsx';
      anchor.click();
      window.URL.revokeObjectURL(url);
    });
  }*/
}
