import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.api';
import { HttpDjangoResponse } from '../models/responses/httpDjangoResponse';

@Injectable({
  providedIn: 'root',
})
export class ResetPasswordEmailService {
  constructor(private http: HttpClient) {}

  requestResetPasswordCode(email: string): Observable<HttpDjangoResponse> {
    const requestUrl = `${environment.baseUrl}password-reset/`;
    return this.http.post<HttpDjangoResponse>(requestUrl, { email: email });
  }

  resetPassword(
    uid: string,
    token: string,
    newPassword: string,
    confirmNewPassword: string
  ): Observable<HttpDjangoResponse> {
    const requestUrl = `${environment.baseUrl}password-reset-confirm/`;
    return this.http.post<HttpDjangoResponse>(requestUrl, {
      uid,
      token,
      new_password: newPassword,
      confirm_new_password: confirmNewPassword,
    });
  }
}
