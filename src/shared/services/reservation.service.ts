import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaderResponse } from '@angular/common/http';
import { SharedService } from './shared.service';
import { apiConfig } from 'src/environments/api-config';
import { LoginService } from './login.service';
import { ReservationResponse } from '../models/responses/reservationResponse';
import { Observable, throwError } from 'rxjs';
import { HttpDjangoResponse } from '../models/responses/httpDjangoResponse';
import { AttendancesPerUserResponse } from '../models/responses/attendancesPerUserResponse';
import { NewReservation } from '../models/entities/newReservation';
import { UserData } from '../models/entities/userData';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private loggedUser: string | null = null;

  constructor(
    private http: HttpClient,
    private loginService: LoginService
  ) {
    /** Data from the logged user */
    this.loginService.getLoggedUserData().subscribe((loggedUser: UserData) => {
      if(loggedUser && loggedUser.uid) {
        this.loggedUser = loggedUser.uid;
      } else {
        this.loggedUser = null;
      }
    });
  }

  /** This is for the user, the method sends the data to make a new reserve */
  submitDataReserve(reservationFormData: NewReservation): Observable<HttpDjangoResponse> {
    const requestUrl = `${apiConfig.baseUrl}CreateReserve/`;
    const currentDate = new Date();

    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const year = currentDate.getFullYear();

    const currentDateString = year + '-' + month + '-' + day;

    if (this.loggedUser) {
      const body = { ...reservationFormData, uid: this.loggedUser, current_date: currentDateString};
      console.log(body);
      return this.http.post<HttpDjangoResponse>(requestUrl, body);
    } else {
      return throwError(() => new Error('Cannot send the reservation: UID not avaliable'));
    }
  }

  /** This is for the user (Requests made by the user) */
  getAttendancesPerUser(uid: string | undefined): Observable<AttendancesPerUserResponse> { 
    const requestUrl = `${apiConfig.baseUrl}AttendancesPerUser/?uid=${uid}`;
    return this.http.get<AttendancesPerUserResponse>(requestUrl);
  }

  cancelReserve(reserveId: number): Observable<HttpDjangoResponse> {
    const requestUrl = `${apiConfig.baseUrl}CancelReserve/`;
    const body = { reservation_id: reserveId };
    return this.http.post<HttpDjangoResponse>(requestUrl, body);
  }

  /** This is for the administrator (Requests made by the admin) */
  getAllReserves(): Observable<ReservationResponse> {
    const requestUrl = `${apiConfig.baseUrl}GetReserveList/`;
    return this.http.get<ReservationResponse>(requestUrl);
  }

  penalizeUser(reserveId: number, date: string): Observable<HttpDjangoResponse> {
    const requestUrl = `${apiConfig.baseUrl}PenalizeUser/`;
    const body = {id: reserveId, date: date};
    return this.http.post<HttpDjangoResponse>(requestUrl, body);
  }

  confirmAttendance(reserveId: number): Observable<HttpDjangoResponse> { 
    const requestUrl = `${apiConfig.baseUrl}CreateAttendance/`;
    const body = {reservation_id: reserveId};
    return this.http.post<HttpDjangoResponse>(requestUrl, body);
  }
}