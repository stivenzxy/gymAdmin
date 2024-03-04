import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class InactivityService {
  private timeoutId: any;
  private alertTimeoutId: any;
  private inactivityLimit = 3 * 60 * 1000; // 3 minutos para el límite de inactividad
  private alertBefore = 1 * 60 * 1000; // Alerta 1 minuto antes

  constructor(private authService: AuthService) {
    this.authService.user.subscribe(user => {
      if (user) {
        this.startMonitoring();
      } else {
        this.stopMonitoring();
      }
    });
  }

  private startMonitoring() {
    this.updateLastActivity();
    this.setupActivityListeners();
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
  }

  private stopMonitoring() {
    clearTimeout(this.timeoutId);
    clearTimeout(this.alertTimeoutId);
    this.removeActivityListeners();
    document.removeEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
  }

  private updateLastActivity() {
    const now = Date.now();
    localStorage.setItem('lastActivity', now.toString());
    this.resetTimer();
  }

  private resetTimer() {
    clearTimeout(this.timeoutId);
    clearTimeout(this.alertTimeoutId);

    this.timeoutId = setTimeout(() => this.checkActivity(), this.inactivityLimit);
    this.alertTimeoutId = setTimeout(() => this.showKeepAliveAlert(), this.inactivityLimit - this.alertBefore);
  }

  private checkActivity() {
    const lastActivity = parseInt(localStorage.getItem('lastActivity') || "0");
    const now = Date.now();
    if (now - lastActivity >= this.inactivityLimit) {
      Swal.close(); // Cierra cualquier alerta abierta
      this.authService.logOut();
      window.location.reload();
    }
  }

  private showKeepAliveAlert() {
    let timeLeft = this.alertBefore / 1000; // Convertir milisegundos a segundos para el contador
    const timerInterval = setInterval(() => {
      timeLeft -= 1;
      if (Swal.isVisible()) {
        Swal.update({
          text: `Tu sesión expirará en: ${Math.max(timeLeft, 0)} segundos`
        });
      }
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        if (Swal.isVisible()) {
          Swal.close();
        }
        this.authService.logOut();
        window.location.reload();
      }
    }, 1000);

    Swal.fire({
      title: '¿Sigues ahí?',
      text: 'Tu sesión expirará pronto.',
      icon: 'warning',
      showCancelButton: false,
      allowOutsideClick: false,
      confirmButtonText: 'Sí, mantener mi sesión',
    }).then((result) => {
      clearInterval(timerInterval); // Detiene el contador independientemente del resultado
      if (result.isConfirmed) {
        this.updateLastActivity(); // El usuario quiere mantener la sesión activa
      }
    });
  }

  private setupActivityListeners() {
    ['click', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
      window.addEventListener(event, this.updateLastActivity.bind(this), true);
    });
  }

  private removeActivityListeners() {
    ['click', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
      window.removeEventListener(event, this.updateLastActivity.bind(this), true);
    });
  }

  private handleVisibilityChange() {
    if (document.visibilityState === 'visible') {
      this.checkActivity(); // Comprueba la actividad al volver a la pestaña
    }
  }
}