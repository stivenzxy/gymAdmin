import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiConfig } from 'src/environments/api-config';
import { MembershipResponse } from '../models/responses/membershipResponse';
import { Observable } from 'rxjs';
import { NewMembership } from '../models/entities/newMembership';
import { HttpDjangoResponse } from '../models/responses/httpDjangoResponse';
import { MembershipIdRequest } from 'src/app/active-membership-list/active-membership-list.component';

@Injectable({
  providedIn: 'root'
})
export class MembershipService {

  constructor(private http: HttpClient) { }

  createNewMembership(membershipData : NewMembership): Observable<HttpDjangoResponse>{
    const requestUrl = `${apiConfig.baseUrl}CreateMembership/`;
    const currentDate = new Date();

    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const year = currentDate.getFullYear();

    const currentDateString = year + '-' + month + '-' + day;

    const body = {...membershipData, current_date: currentDateString}
    return this.http.post<HttpDjangoResponse>(requestUrl, body);
  }

  getMemberships(): Observable<MembershipResponse> {
    const requestUrl = `${apiConfig.baseUrl}GetMemberships/`;
    return this.http.get<MembershipResponse>(requestUrl);
  }

  cancelMembership(body: MembershipIdRequest): Observable<HttpDjangoResponse> {
    const requestUrl = `${apiConfig.baseUrl}CancelMembership/`;
    return this.http.post<HttpDjangoResponse>(requestUrl, body);
  }
}
