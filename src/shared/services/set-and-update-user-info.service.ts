import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiConfig } from 'src/environments/api-config';

@Injectable({
  providedIn: 'root'
})
export class SetAndUpdateUserInfoService {
  private apiUrl = `${apiConfig.baseUrl}users/`

  constructor(private http: HttpClient) { }

  getUserData(uid: string): Observable<any> {
    return this.http.get(`${this.apiUrl}${uid}/`);
  }

  updateUserData(uid: string, data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}${uid}/`, data);
  }
}
