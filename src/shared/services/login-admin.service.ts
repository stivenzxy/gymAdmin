import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService, CookieOptions } from 'ngx-cookie-service';
import { Subject } from 'rxjs'
import { apiConfig } from 'src/environments/api-config';

@Injectable({
  providedIn: 'root'
})
export class LoginAdminService {
<<<<<<< HEAD
  private apiUrl = 'http://127.0.0.1:8000/gym/login/';
  private closeLoginModalSubject = new Subject<void>();
=======
  private apiUrl = `${apiConfig.baseUrl}login/`

  //private closeLoginModalSubject = new Subject<void>();
>>>>>>> 2a5b9b21f6e9fe112540b1fd7a767e1b73a07f83
  adminAuthStatusChanged: any;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
  ) {}

  saveUserData(data: any) {
    try {
      const adminData = JSON.stringify(data);
      const cookieOptions: CookieOptions = { secure: true, path: '/' };
      this.cookieService.set('admin', adminData, cookieOptions);
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  }

  getUserData() {
    try {
      const adminData = this.cookieService.get('admin');
      return adminData ? JSON.parse(adminData) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  isLoggedIn() {
    const user = this.getUserData();
    return user && user.username;
  }

  logout() {
    this.cookieService.delete('admin', '/');
  }

  submitDataAdmin(loginDataForm: any) {
    console.log(loginDataForm);
    return this.http.post(this.apiUrl, loginDataForm);
  }
}
