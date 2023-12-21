import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private apiUrl = 'http://192.168.133.178:8000/Reporte/'

  constructor(private http: HttpClient) {}

  descargarReporte() {
    return this.http.get(this.apiUrl, { responseType: 'blob' }); // tipo de respuesta: Binary Large Object
  }
}
