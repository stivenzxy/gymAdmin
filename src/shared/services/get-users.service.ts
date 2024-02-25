import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiConfig } from 'src/environments/api-config';

@Injectable({
  providedIn: 'root'
})
export class GetUsersService {
  private apiUrl = `${apiConfig.baseUrl}GetUsers/`;
  private apiUrlAttendance = `${apiConfig.baseUrl}CrearAsistenciaSinReserva/`;
  
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

  sendUserAttendanceData(dataForm : any): Observable<any> {
    var currentDate = new Date();

    var day = String(currentDate.getDate()).padStart(2, '0');
    var month = String(currentDate.getMonth() + 1).padStart(2, '0');
    var year = currentDate.getFullYear();

    const currentDateString = year + '-' + month + '-' + day;

    //console.log(dataForm);
    const body = {...dataForm, fecha: currentDateString};
    console.log(body);
    return this.http.post(this.apiUrlAttendance, body);
  }
}
