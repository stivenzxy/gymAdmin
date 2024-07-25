import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import Swal from 'sweetalert2';
import { LoginService } from '../services/login.service';

export const reserveHistoryGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  console.log('AuthGuard is running');
  const router = inject(Router);
  const loginService = inject(LoginService);

  const isClientLogin = loginService.isUserLoggedIn();

  if (!isClientLogin) {
    guardAlert();
    return false;
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
            router.navigate(['dashboard'], {replaceUrl: true});
          }
        });
      } catch (error) {
        console.log('The process failed with error: ' + error);
      }
    }
};



