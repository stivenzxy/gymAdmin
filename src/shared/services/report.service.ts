import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private requestUrl = `${environment.baseUrl}GetReport/`

  constructor(private http: HttpClient) {}

  downloadAttendanceReport(): Observable<Blob> {
    return this.http.get(this.requestUrl, { responseType: 'blob' }); // Response type: Binary Large Object
  }
}
