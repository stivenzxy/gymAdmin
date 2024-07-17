import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService, CookieOptions } from 'ngx-cookie-service';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { apiConfig } from 'src/environments/api-config';
import { UserData } from '../models/entities/userData';
import { LoginResponse } from '../models/responses/loginResponse';
import {jwtDecode} from 'jwt-decode';
import { TokenResponse } from '../models/responses/tokenResponse';
import { LoginData } from '../models/entities/loginData';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl = `${apiConfig.baseUrl}Login/`;
  private refreshUrl = `${apiConfig.baseUrl}token/refresh/`;

  private adminAuthStatus = new BehaviorSubject<boolean>(this.isAdminLoggedIn());
  private userAuthStatus = new BehaviorSubject<boolean>(this.isUserLoggedIn());
  private userDataSubject = new BehaviorSubject<any>(this.getUserDataFromCookies());

  private tokenCheckInterval: any;

  currentAccessTkn: BehaviorSubject<string> = new BehaviorSubject<string>('');
  currentRefreshTkn: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(private http: HttpClient, private cookieService: CookieService) {
    const savedAccessToken = this.cookieService.get('access_token');
    const savedRefreshToken = this.cookieService.get('refresh_token');

    this.currentAccessTkn.next(savedAccessToken || '');
    this.currentRefreshTkn.next(savedRefreshToken || '');

    if (savedAccessToken) {
      this.startTokenCheck(); // Start checking token on initialization if token exists
    }
  }

  saveUserData(data: UserData) {
    try {
      const userData = JSON.stringify(data);
      const cookieOptions: CookieOptions = { secure: true, path: '/' };

      if (data.is_admin) {
        this.cookieService.set('admin', userData, cookieOptions);
        this.saveTokens(data.access ?? "", data.refresh ?? "");
      } else {
        this.cookieService.set('user', userData, cookieOptions);
        this.saveTokens(data.access ?? "", data.refresh ?? "");
      }
      this.userDataSubject.next(data);
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  }

  private getUserDataFromCookies() {
    try {
      const adminData = this.cookieService.get('admin');
      const userData = this.cookieService.get('user');

      if (adminData) {
        return JSON.parse(adminData);
      } else if (userData) {
        return JSON.parse(userData);
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  getLoggedUserData(): Observable<UserData> {
    return this.userDataSubject.asObservable();
  }

  isLoggedIn() {
    const user = this.getUserDataFromCookies();
    return user && user.username;
  }

  isAdminLoggedIn() {
    const adminData = this.cookieService.get('admin');
    return adminData ? JSON.parse(adminData).is_admin : false;
  }

  isUserLoggedIn() {
    const userData = this.cookieService.get('user');
    return userData ? !JSON.parse(userData).is_admin : false;
  }

  getAdminAuthStatus(): Observable<boolean> {
    return this.adminAuthStatus.asObservable();
  }

  getUserAuthStatus(): Observable<boolean> {
    return this.userAuthStatus.asObservable();
  }

  logOut() {
    this.cookieService.delete('admin', '/');
    this.cookieService.delete('user', '/');
    this.cookieService.delete('access_token', '/');
    this.cookieService.delete('refresh_token', '/');
    this.adminAuthStatus.next(false);
    this.userAuthStatus.next(false);
    this.userDataSubject.next(null);
    this.stopTokenCheck(); // Stop checking tokens on logout
    window.location.reload();
  }

  submitLoginData(loginDataForm: LoginData): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiUrl, loginDataForm).pipe(
      tap((response: LoginResponse) => {
        this.saveUserData(response.data);
      })
    );
  }

  private saveTokens(accessToken: string, refreshToken: string) {
    const cookieOptions: CookieOptions = { secure: true, path: '/' };
    this.cookieService.set('access_token', accessToken, cookieOptions);
    this.cookieService.set('refresh_token', refreshToken, cookieOptions);
    this.currentAccessTkn.next(accessToken);
    this.currentRefreshTkn.next(refreshToken);
    this.startTokenCheck(); // Start token check when tokens are saved
    console.log("Token de acceso guardado: ", accessToken);
  }

  getAccessToken(): string {
    return this.cookieService.get('access_token');
  }

  refreshAccessToken(): Observable<TokenResponse> {
    const refreshToken = this.cookieService.get('refresh_token');
    return this.http.post<TokenResponse>(this.refreshUrl, { refresh: refreshToken }).pipe(
      tap((tokens: TokenResponse) => {
        this.saveTokens(tokens.access, refreshToken);
      })
    );
  }

  private startTokenCheck(): void {
    this.stopTokenCheck(); // Clear any existing intervals
    this.tokenCheckInterval = setInterval(() => {
      const accessToken = this.cookieService.get('access_token');
      if (this.isTokenExpired(accessToken)) {
        this.refreshAccessToken().subscribe({
          error: () => this.logOut(), // Log out if the refresh fails
        });
      }
    }, 60000); // Check every minute
  }

  private stopTokenCheck(): void {
    if (this.tokenCheckInterval) {
      clearInterval(this.tokenCheckInterval);
      this.tokenCheckInterval = null;
    }
  }

  isTokenExpired(accessToken: string | null): boolean {
    if (accessToken) {
      const decoded = jwtDecode<any>(accessToken);
      return Date.now() >= decoded.exp * 1000;
    }
    return true;
  }
}
