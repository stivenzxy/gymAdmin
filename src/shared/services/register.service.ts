import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment.api';
import { RegisterUserData } from '../models/entities/register.extraData';
import { HttpDjangoResponse } from '../models/responses/httpDjangoResponse';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private requestUrl = `${environment.baseUrl}CreateUser/`;

  constructor(private http: HttpClient, private sharedService: SharedService) {}

  registerUser(
    extraDataForm: RegisterUserData
  ): Observable<HttpDjangoResponse> {
    return this.sharedService.currentUser.pipe(
      switchMap((GoogleUserData) => {
        if (GoogleUserData) {
          // data from fireAuth (Google Firebase Service)
          const { displayName, email, uid, photoURL } = GoogleUserData;
          // data from user input (Client)
          const { program, student_code, password } = extraDataForm;

          // Finish data to register a new user
          const dataToSend = {
            username: displayName,
            email: email,
            uid: uid,
            program: program,
            student_code: student_code,
            password: password,
            photo_url: photoURL,
          };

          console.log(dataToSend);
          return this.http.post<HttpDjangoResponse>(
            this.requestUrl,
            dataToSend
          );
        } else {
          //throw new Error('User data not available');
          return EMPTY; // returns EMPTY observable to ignore some error 
        }
      })
    );
  }
}