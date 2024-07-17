import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { LoginService } from '../login.service';

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptorService implements HttpInterceptor {

  constructor(private loginService: LoginService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.loginService.currentAccessTkn.pipe(
      take(1), // Take the most recent token and complete
      switchMap(accessToken => {
        if (accessToken) {
          req = req.clone({
            setHeaders: {
              'Authorization': `Bearer ${accessToken}`,
            },
          });
        }
        return next.handle(req);
      })
    );
  }
}
