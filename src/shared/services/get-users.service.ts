import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetUsersService {

  private apiUrl = 'http://192.168.0.7:8000/gym/GetUsers/'

  constructor(private http: HttpClient){}

  getUsers(codEstudiante?: string): Observable<any> {
    let params = new HttpParams();
    if (codEstudiante) {
      params = params.append('cod_estudiante', codEstudiante);
    }
    return this.http.get(this.apiUrl, { params: params });
  }

  getUsersWithoutCod(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
