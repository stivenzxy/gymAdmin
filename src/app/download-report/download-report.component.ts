import { Component, OnInit } from '@angular/core';
import { AttendanceReport } from 'src/shared/models/entities/attendanceReport';
import { ReportService } from 'src/shared/services/report.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-download-report',
  templateUrl: './download-report.component.html',
  styleUrls: ['./download-report.component.scss']
})
export class DownloadReportComponent implements OnInit {
  excelData: AttendanceReport[] = [];
  fileData!: Blob;
  dataAvailable: boolean = false;

  constructor(private reporteService: ReportService) { }

  ngOnInit() {
    this.loadExcelFile();
  }

  loadExcelFile() {
    this.reporteService.downloadAttendanceReport().subscribe((data: Blob)=> {
      this.fileData = data;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const bstr: string = e.target.result;
        const workbook = XLSX.read(bstr, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        this.excelData = XLSX.utils.sheet_to_json<AttendanceReport>(worksheet);
        this.dataAvailable = this.excelData && this.excelData.length > 0;
      };
      reader.readAsBinaryString(data);
      
    });
  }

  downloadFile() {
    const fechaActual = new Date();

    var day = String(fechaActual.getDate()).padStart(2, '0');
    var month = String(fechaActual.getMonth() + 1).padStart(2, '0');
    var year = fechaActual.getFullYear();

    const fecha = year + '-' + month + '-' + day;

    const url = window.URL.createObjectURL(this.fileData);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `asistencias_${fecha}.xlsx`;
    anchor.click();
    window.URL.revokeObjectURL(url);
  }

  getFieldValue<T extends keyof AttendanceReport>(row: AttendanceReport, key: T): AttendanceReport[T] {
    return row[key];
  }
}
