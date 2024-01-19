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
  
        // Convertir la hoja de cálculo a JSON
        let jsonData = XLSX.utils.sheet_to_json(worksheet);
  
        // Mapear los datos para convertir las fechas y horas de Excel
        this.excelData = jsonData.map((row: any) => {
          if(row.FECHA) row.FECHA = this.convertExcelDate(row.FECHA);
          if(row.HORA) row.HORA = this.convertExcelTime(row.HORA);
          return row;
        });
  
        this.dataAvailable = this.excelData && this.excelData.length > 0;
      };
      reader.readAsBinaryString(data);
    });
  }
  

  downloadFile() {
    const url = window.URL.createObjectURL(this.fileData);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'reservas.xlsx';
    anchor.click();
    window.URL.revokeObjectURL(url);
  }


  convertExcelDate(excelDateNum: any) {
    // Convertir número de serie de Excel a fecha
    const date = new Date((excelDateNum - (25567 + 2))*86400*1000);
    return date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  }
  
  convertExcelTime(excelTimeNum: any) {
    // Convertir número de serie de Excel a hora
    const time = new Date(excelTimeNum * 86400 * 1000);
    return time.toISOString().substring(11, 8); // Formato HH:MM:SS
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
