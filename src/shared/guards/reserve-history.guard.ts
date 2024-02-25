import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import Swal from 'sweetalert2';

export const reserveHistoryGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  console.log('AuthGuard is running');
  const authService = inject(AuthService);
  const router = inject(Router);

  const isClientLogin = authService.isLoggedIn;

  // El guard debe activarse si no hay un administrador logueado.
  if (!isClientLogin) {
    guardAlert();
    //router.navigate(['dashboard']);
    return false; // Previene la navegación porque no hay un administrador logueado
  }
  return true;
    
    function guardAlert() {
      try {
        Swal.fire({
          title: 'Acceso Denegado!',
          text: 'Solo los clientes pueden visualizar su historial de reservas.',
          icon: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Aceptar',
        }).then((result) => {
          if(result.isConfirmed) {
            window.location.reload();
          }
        });
      } catch (error) {
        console.log('The process failed with error: ' + error);
      }
    }
};



