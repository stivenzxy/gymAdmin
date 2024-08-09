import { Injectable } from '@angular/core';
import { GoogleAuthService } from './googleAuth.service';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class InactivityService {
  private timeoutId: any;
  private alertTimeoutId: any;
  private inactivityLimit = 2 * 60 * 1000;
  private alertBefore = 30 * 1000;

  constructor(private preRegisterService: GoogleAuthService, private dialog: MatDialog) {
    this.preRegisterService.isLoggedInObservable.subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        this.startMonitoring();
      } else {
        this.stopMonitoring();
      }
    });
  }

  private startMonitoring() {
    this.updateLastActivity();
    this.setupActivityListeners();
    document.addEventListener(
      'visibilitychange',
      this.handleVisibilityChange.bind(this)
    );
  }

  private stopMonitoring() {
    clearTimeout(this.timeoutId);
    clearTimeout(this.alertTimeoutId);
    this.removeActivityListeners();
    document.removeEventListener(
      'visibilitychange',
      this.handleVisibilityChange.bind(this)
    );
  }

  private updateLastActivity() {
    const now = Date.now();
    localStorage.setItem('lastActivity', now.toString());
    this.resetTimer();
  }

  private resetTimer() {
    clearTimeout(this.timeoutId);
    clearTimeout(this.alertTimeoutId);

    if (this.preRegisterService.isGoogleInfoAvaliable() !== false) {
      this.timeoutId = setTimeout(
        () => this.checkActivity(),
        this.inactivityLimit
      );

      this.alertTimeoutId = setTimeout(
        () => this.showKeepAliveAlert(),
        this.inactivityLimit - this.alertBefore
      );
    }
  }


  private checkActivity() {
    const lastActivity = parseInt(localStorage.getItem('lastActivity') || '0');
    const now = Date.now();
    if (now - lastActivity >= this.inactivityLimit) {
      Swal.close();
      localStorage.setItem('register', JSON.stringify(true));
      localStorage.removeItem('lastActivity');
      this.preRegisterService.logOut();
      window.location.reload();
    }
  }

  private showKeepAliveAlert() {
    if (this.preRegisterService.isGoogleInfoAvaliable()) {
      let timeLeft = this.alertBefore / 1000;
      const timerInterval = setInterval(() => {
        timeLeft -= 1;
        if (Swal.isVisible()) {
          Swal.update({
            text: `El tiempo para el registro expirará en: ${Math.max(
              timeLeft,
              0
            )} segundos`,
          });
        }
        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          if (Swal.isVisible()) {
            Swal.close();
          }
        }
      }, 1000);

      this.dialog.closeAll();

      Swal.fire({
        title: '¿Sigues ahí?',
        text: 'Debes finalizar el registro para poder utilizar FitLynx.',
        icon: 'warning',
        showCancelButton: false,
        allowOutsideClick: false,
        confirmButtonText: 'Continuar registro',
        cancelButtonText: 'Cancelar registro',
      }).then((result) => {
        clearInterval(timerInterval);
        if (result.isConfirmed) {
          this.updateLastActivity();
          this.preRegisterService.openInitDialog();
        }
      });
    }
  }

  private setupActivityListeners() {
    ['click', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(
      (event) => {
        window.addEventListener(
          event,
          this.updateLastActivity.bind(this),
          true
        );
      }
    );
  }

  private removeActivityListeners() {
    ['click', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(
      (event) => {
        window.removeEventListener(
          event,
          this.updateLastActivity.bind(this),
          true
        );
      }
    );
  }

  private handleVisibilityChange() {
    if (document.visibilityState === 'visible') {
      this.checkActivity();
    }
  }
}
