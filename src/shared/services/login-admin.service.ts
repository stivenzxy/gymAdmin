import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginAdminService {
  // aqui debe ir la ruta exacta de la funcion implementada en el backend, ejemplo: http://localhost:8000/admin
  private apiUrl = 'http://backendUrl';

  constructor(private http: HttpClient) { }

  submitDataAdmin(loginDataForm : any) {
    console.log(loginDataForm);
    return this.http.post(this.apiUrl, loginDataForm);
  }

}
