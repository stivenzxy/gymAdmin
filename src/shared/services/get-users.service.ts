import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiConfig } from 'src/environments/api-config';
import { UserListResponse } from '../models/responses/userListResponse';
import { HttpDjangoResponse } from '../models/responses/httpDjangoResponse';

@Injectable({
  providedIn: 'root'
})
export class GetUsersService {
  constructor(private http: HttpClient){}

  getUserWithStudentCode(studentCode?: string): Observable<UserListResponse> {
    const requestUrl = `${apiConfig.baseUrl}GetUsers/`;

    let params = new HttpParams();
    if (studentCode) {
      params = params.append('student_code', studentCode);
    }
    return this.http.get<UserListResponse>(requestUrl, { params: params });
  }

  getAllUsers(): Observable<UserListResponse> {
    const requestUrl = `${apiConfig.baseUrl}GetUsers/`;
    return this.http.get<UserListResponse>(requestUrl);
  }

  sendUserAttendanceData(dataForm : any): Observable<HttpDjangoResponse> {
    const requestUrl = `${apiConfig.baseUrl}CreateAttnNoReserve/`;
    const currentDate = new Date();

    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const year = currentDate.getFullYear();

    const currentDateString = year + '-' + month + '-' + day;

    const body = {...dataForm, fecha: currentDateString};
    console.log(body);
    return this.http.post<HttpDjangoResponse>(requestUrl, body);
  }
}
