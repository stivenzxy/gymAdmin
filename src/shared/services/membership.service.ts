import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MembershipService {

  private apiUrl = 'http://192.168.0.6:8000/gym/CreateMembresia/'

  constructor(private http: HttpClient) { }

  submitMembership(formData : any){
    const body = {...formData}
    return this.http.post(this.apiUrl, body);
  }
}
