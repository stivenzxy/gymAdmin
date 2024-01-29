import { Injectable, NgZone } from '@angular/core';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http'
import { InitformComponent } from 'src/app/initform/initform.component';
import { MatDialog } from '@angular/material/dialog';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  //////////////////////////////////////////
  // para enviar el Uid y el nombre de usuario al backend:
  private apiUrl = 'http://192.168.0.7:8000/gym/CheckUser/'
 //////////////////////////////////////////

 
  private logoutSubject = new Subject<void>();
  public onLogout = this.logoutSubject.asObservable();
  userData: any;
  //public onLogout = new EventEmitter<void>();
  private userSubject = new BehaviorSubject<any>(null);
  public user = this.userSubject.asObservable();
  authStatusChanged: any;

  constructor(
    private http: HttpClient,
    private firebaseAuthenticationService: AngularFireAuth,
    private router: Router,
    private ngZone: NgZone,
    private cookieService: CookieService,
    private dialog: MatDialog,
    private sharedService: SharedService
  ) {
    this.firebaseAuthenticationService.authState.subscribe((user) => {
      if(user) {
        this.userData = user;
        this.userSubject.next(this.userData);
        this.cookieService.set('user', JSON.stringify(this.userData));

        const uid = user.uid;
        const usernameClient = user.displayName ?? '';
        const emailClient = user.email ?? '';

        this.sendUserDataToBackend(uid, usernameClient);

        if (this.userData && this.userData.uid) {
          this.sharedService.changeUser(this.userData);
        }
      } else {
        this.userData = null;
        this.sharedService.changeUser(null);
        this.userSubject.next(null);
        this.cookieService.delete('user');
      }
    });
  }

   // log-in with google
   logInWithGoogleProvider() {
    return this.firebaseAuthenticationService.signInWithRedirect(new GoogleAuthProvider())
      .then(() => this.observeUserState())
      .catch((error: Error) => {
        alert(error.message);
      })
  }

  observeUserState() {
    this.firebaseAuthenticationService.authState.subscribe((userState) => {
      userState && this.ngZone.run(() => this.router.navigate(['dashboard']))
    })
  }

  get isLoggedIn() : boolean {
    const user = this.cookieService.get('user');
    return user !== '' && user !== null && user !== 'null';
  }

  logOut() {
    return this. firebaseAuthenticationService.signOut().then(() => {
      this.cookieService.deleteAll('/');
      this.userSubject.next(null); // se establecen en null los datos al cerrar la sesion
      this.sharedService.changeUser(null);
      this.router.navigate(['dashboard']);
      //this.onLogout.emit();
      this.logoutSubject.next();
    })
  }



  /// enviar los datos al backend
  sendUserDataToBackend(uid: string, usernameClient: string) {
    console.log(uid, usernameClient);
    const body = { uid: uid, displayName: usernameClient };
    return this.http.post<any>(this.apiUrl, body).subscribe({
      next: (response) => {
        console.log('Respuesta del servidor:', response);
        if (response.user_exists) {
          console.log('El usuario existe');
        } else {
         // alert('El usuario no existe');
          this.openLoginDialog();
        }
      },
      error: (error) => {
        console.error('Error al enviar los datos', error);
      }
    });
  }

  openLoginDialog(): void {
    const dialogRef = this.dialog.open(InitformComponent, {
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }


  
}
