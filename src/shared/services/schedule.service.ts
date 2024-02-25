import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiConfig } from 'src/environments/api-config';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  constructor(private http: HttpClient) { }

  obtenerHorarios(): Observable<{success: boolean, horarios: any[]}> {
    const url = `${apiConfig.baseUrl}GetHorarios/`;
    return this.http.get<{success: boolean, horarios: any[]}>(url);
  }
}
