import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  constructor(private http: HttpClient) { }

  obtenerHorarios(): Observable<{success: boolean, horarios: any[]}> {
    const url = 'http://192.168.0.7:8000/gym/GetHorarios/';
    return this.http.get<{success: boolean, horarios: any[]}>(url);
  }
}
