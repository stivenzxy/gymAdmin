import { EventEmitter, Injectable, NgZone } from '@angular/core';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private logoutSubject = new Subject<void>();
  public onLogout = this.logoutSubject.asObservable();
  userData: any;
  //public onLogout = new EventEmitter<void>();
  private userSubject = new BehaviorSubject<any>(null);
  public user = this.userSubject.asObservable();

  constructor(
    private firebaseAuthenticationService: AngularFireAuth,
    private router: Router,
    private ngZone: NgZone,
    private cookieService: CookieService
  ) {
    this.firebaseAuthenticationService.authState.subscribe((user) => {
      if(user) {
        this.userData = user;
        this.userSubject.next(this.userData);
        this.cookieService.set('user', JSON.stringify(this.userData));

        console.log('Nombre del usuario:', user.displayName);
        console.log('Email del usuario:', user.email);
        console.log('Foto de perfil del usuario:', user.photoURL);
      } else {
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
      this.router.navigate(['dashboard']);
      //this.onLogout.emit();
      this.logoutSubject.next();
    })
  }
}
