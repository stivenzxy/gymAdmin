import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.api';
import { UserData } from '../models/entities/userData';
import { UpdateUserResponse } from '../models/responses/updateUserResponse';

@Injectable({
  providedIn: 'root'
})
export class SetAndUpdateUserInfoService {
  private requestUrl = `${environment.baseUrl}users/`

  constructor(private http: HttpClient) { }

  getUserData(uid: string | undefined): Observable<UserData> {
    return this.http.get<UserData>(`${this.requestUrl}${uid}/`);
  }

  updateUserData(uid: string | undefined, data: UserData): Observable<UpdateUserResponse> {
    return this.http.patch<UpdateUserResponse>(`${this.requestUrl}${uid}/`, data);
  }
}
