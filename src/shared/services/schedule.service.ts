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
<<<<<<< HEAD
    const url = 'http://127.0.0.1:8000/gym/GetHorarios/';
=======
    const url = `${apiConfig.baseUrl}GetHorarios/`;
>>>>>>> 2a5b9b21f6e9fe112540b1fd7a767e1b73a07f83
    return this.http.get<{success: boolean, horarios: any[]}>(url);
  }
}
