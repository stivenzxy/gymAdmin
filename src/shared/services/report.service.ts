import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiConfig } from 'src/environments/api-config';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
<<<<<<< HEAD

  private apiUrl = 'http://127.0.0.1:8000/gym/Reporte/'
=======
  private apiUrl = `${apiConfig.baseUrl}Reporte/`
>>>>>>> 2a5b9b21f6e9fe112540b1fd7a767e1b73a07f83

  constructor(private http: HttpClient) {}

  descargarReporte() {
    return this.http.get(this.apiUrl, { responseType: 'blob' }); // tipo de respuesta: Binary Large Object
  }
}
