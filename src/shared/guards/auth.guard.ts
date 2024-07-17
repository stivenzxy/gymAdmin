import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import Swal from 'sweetalert2';
import { DialogService } from '../guards/dialog.service';
import { LoginService } from '../services/login.service';

export const AuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  console.log('AuthGuard is running');
  const loginService = inject(LoginService);
  const router = inject(Router);
  const dialog = inject(DialogService);

  const isAdminLoggedIn = loginService.isAdminLoggedIn();

  if (!isAdminLoggedIn) {
    guardAlert();
    return false;
  }
  return true;
    
    function guardAlert() {
      try {
        Swal.fire({
          title: 'Acceso Denegado!',
          text: 'Necesitas iniciar sesion como administrador para acceder a esta funcion',
          icon: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Aceptar',
        }).then((result) => {
          if(result.isConfirmed) {
            router.navigate(['dashboard'], {replaceUrl: true})
          }
        });
      } catch (error) {
        console.log('The process failed with error: ' + error);
      }
    }
};



