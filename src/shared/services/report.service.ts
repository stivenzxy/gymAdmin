import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiConfig } from 'src/environments/api-config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private requestUrl = `${apiConfig.baseUrl}GetReport/`

  constructor(private http: HttpClient) {}

  downloadAttendanceReport(): Observable<Blob> {
    return this.http.get(this.requestUrl, { responseType: 'blob' }); // Response type: Binary Large Object
  }
}
