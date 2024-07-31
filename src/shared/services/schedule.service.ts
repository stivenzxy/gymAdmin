import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.api';
import { ScheduleResponse } from '../models/responses/scheduleResponse';
import { HttpDjangoResponse } from '../models/responses/httpDjangoResponse';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  constructor(private http: HttpClient) { }

  getSchedule(): Observable<ScheduleResponse> {
    const requestUrl = `${environment.baseUrl}GetSchedule/`;
    return this.http.get<ScheduleResponse>(requestUrl);
  }

  updateSchedule(updatedSchedule: any): Observable<HttpDjangoResponse> {
    console.log("Schedule in Service", updatedSchedule);
    const requestUrl = `${environment.baseUrl}UpdateSchedule/`;
    return this.http.post<HttpDjangoResponse>(requestUrl, updatedSchedule);
  }
}