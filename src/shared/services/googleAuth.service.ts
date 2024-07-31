import { Injectable, NgZone } from '@angular/core';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { InitformComponent } from 'src/app/initform/initform.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SharedService } from './shared.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment.api';
import { GoogleAuthData } from '../models/entities/googleAuthData';

@Injectable({
  providedIn: 'root',
})
export class GoogleAuthService {
  private apiUrl = `${environment.baseUrl}CheckUser/`;

  private loadingSubject = new BehaviorSubject<boolean>(true);
  public loading = this.loadingSubject.asObservable();

  // used to close the LoginComponent modal
  private loginSubject = new BehaviorSubject<boolean>(false);
  public loginObservable = this.loginSubject.asObservable();

  public logoutSubject = new Subject<void>();
  public onLogout = this.logoutSubject.asObservable();

  private userSubject = new BehaviorSubject<any>(null);
  public user = this.userSubject.asObservable();

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  public isLoggedInObservable = this.isLoggedInSubject.asObservable();

  userData: any;

  constructor(
    private http: HttpClient,
    private firebaseAuthenticationService: AngularFireAuth,
    private router: Router,
    private ngZone: NgZone,
    private cookieService: CookieService,
    private dialog: MatDialog,
    private sharedService: SharedService
  ) {
    this.loadingSubject.next(true);

    this.firebaseAuthenticationService.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        this.userSubject.next(this.userData);
        this.cookieService.set(
          'userInRegister',
          JSON.stringify(this.userData),
          1 / 96,
          '/'
        );

        const uid = user.uid;
        const usernameClient = user.displayName ?? '';
        const emailClient = user.email ?? '';

        this.sendUserDataToBackend(uid, usernameClient, emailClient).add(() => {
          this.loadingSubject.next(false);
        });

        if (this.userData && this.userData.uid) {
          this.sharedService.changeUser(this.userData);
        }
      } else {
        this.userData = null;
        this.sharedService.changeUser(null);
        this.userSubject.next(null);
        this.cookieService.delete('userInRegister');

        this.loadingSubject.next(false);
      }
    });
  }

  // log-in with google
  async registerWithGoogleProvider() {
    try {
      await this.firebaseAuthenticationService.signInWithPopup(
        new GoogleAuthProvider()
      );
      this.observeUserState();
      this.notifyLoginSuccess();
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        console.log(
          'El usuario cerró la ventana emergente antes de completar el inicio de sesión.'
        );
      } else {
        console.error('Error de inicio de sesión:', error.message);
      }
    }
  }

  notifyLoginSuccess() {
    this.loginSubject.next(true);
  }

  observeUserState() {
    this.firebaseAuthenticationService.authState.subscribe((userState) => {
      if (userState) {
        this.ngZone.run(() => {
          this.router.navigate(['dashboard']);
        });
      }
    });
  }

  isLoggedIn(): boolean {
    const user = this.cookieService.get('userInRegister');
    return user !== '' && user !== null && user !== 'null';
  }

  logOut() {
    return this.firebaseAuthenticationService.signOut().then(() => {
      this.cookieService.deleteAll('/');
      this.userSubject.next(null);
      this.sharedService.changeUser(null);
      this.router.navigate(['dashboard']);
    });
  }

  sendUserDataToBackend(
    uid: string,
    usernameClient: string,
    emailClient: string
  ) {
    const body = { uid: uid, displayName: usernameClient, email: emailClient };
    return this.http.post<any>(this.apiUrl, body).subscribe({
      next: (response) => {
        if (response.user_exists) {
          console.log('respuesta del servidor: ', response.message);
        } else {
          this.openInitDialog();
        }
      },
      error: (error) => {
        console.error('Error al enviar los datos', error.error.message);
        let errorMessage = 'Error desconocido';

        this.clearUserData();

        if (error.status === 401) {
          errorMessage = error.error.message || 'Dirección de correo no compatible con la institución.';

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: errorMessage,
            confirmButtonColor: 'orange',
            confirmButtonText: 'Volver al inicio',
            allowOutsideClick: false,
          }).then((result) => {
            if (result.isConfirmed) {
              this.logOut();
              this.logoutSubject.next();
            }
          });
        } else if(error.status === 403) {
          errorMessage = error.error.message || 'El usuario ya se encuentra registrado.';

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: errorMessage,
            confirmButtonColor: 'orange',
            confirmButtonText: 'Ir al login',
            allowOutsideClick: false,
          }).then((result) => {
            if (result.isConfirmed) {
              this.logOut();
              this.logoutSubject.next();
            }
          });
        } else if (error.status === 500) {
          errorMessage = error.error.message || 'Error interno del servidor';
        }
      },
    });
  }

  openInitDialog(): void {
    const dialogRef = this.dialog.open(InitformComponent, {
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  private clearUserData() {
    this.userData = null;
    this.userSubject.next(null);
    this.cookieService.delete('userInRegister');
    this.sharedService.changeUser(null);
  }
}