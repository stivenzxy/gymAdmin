import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiConfig } from 'src/environments/api-config';

@Injectable({
  providedIn: 'root'
})
export class MembershipService {
<<<<<<< HEAD

  private apiUrl = 'http://127.0.0.1:8000/gym/CreateMembresia/'
=======
  private apiUrl = `${apiConfig.baseUrl}CreateMembresia/`
>>>>>>> 2a5b9b21f6e9fe112540b1fd7a767e1b73a07f83

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
