import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiConfig } from 'src/environments/api-config';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = `${apiConfig.baseUrl}Reporte/`

  constructor(private http: HttpClient) {}

  descargarReporte() {
    return this.http.get(this.apiUrl, { responseType: 'blob' }); // tipo de respuesta: Binary Large Object
  }
}
