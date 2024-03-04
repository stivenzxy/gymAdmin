import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MembershipService {

  private apiUrl = 'http://127.0.0.1:8000/gym/CreateMembresia/'

  constructor(private http: HttpClient) { }

  submitMembership(formData : any){
    const body = {...formData}
    return this.http.post(this.apiUrl, body);
  }
}
