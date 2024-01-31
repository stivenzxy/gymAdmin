import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MembershipService {

  private apiUrl = 'http://192.168.0.8:8000/gym/CreateMembresia/'

  constructor(private http: HttpClient) { }

  submitMembership(formData : any){
    var currentDate = new Date();

    var day = String(currentDate.getDate()).padStart(2, '0');
    var month = String(currentDate.getMonth() + 1).padStart(2, '0');
    var year = currentDate.getFullYear();

    const currentDateString = year + '-' + month + '-' + day;

    const body = {...formData, fecha_actual: currentDateString}
    return this.http.post(this.apiUrl, body);
  }
}
