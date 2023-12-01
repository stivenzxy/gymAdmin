import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginAdminService {
  // aqui debe ir la ruta exacta de la funcion implementada en el backend, ejemplo: http://localhost:8000/admin
  private apiUrl = 'http://172.17.213.169:8000/login/'

  constructor(private http: HttpClient) { }

  saveUserData(data: any) {
    localStorage.setItem('user', JSON.stringify(data));
  }

  getUserData() {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  isLoggedIn() {
    const user = this.getUserData();
    return !!user && !!user.username; // Asegúrate de que haya datos de usuario
  }

  logout() {
    localStorage.removeItem('user');
  }

  submitDataAdmin(loginDataForm : any) {
    console.log(loginDataForm);
    return this.http.post(this.apiUrl, loginDataForm);
  }

}
