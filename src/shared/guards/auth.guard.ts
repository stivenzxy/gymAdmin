import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import Swal from 'sweetalert2';
import { DialogService } from '../guards/dialog.service';

export const AuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    console.log('AuthGuard is running');
    const authService = inject(AuthService);
    const router = inject(Router);
    const dialog = inject(DialogService);

    if (!authService.isLoggedIn) {
      guardAlert();
      router.navigate(['dashboard']);
      return false; // Prevent the navigation because the user is not logged in
    }

    return true; // Allow the navigation to proceed if the user is logged in
    
    function guardAlert() {
      try {
        Swal.fire({
          title: 'Acceso Denegado!',
          text: 'Necesitas iniciar sesion como administrador para acceder a esta funcion',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Iniciar Sesion',
          cancelButtonText: 'Cancelar',
          confirmButtonColor: '#D8A616',
          cancelButtonColor: '#D30404'
        }).then((result) => {
          if(result.isConfirmed) {
            dialog.openLoginDialog();
          }
        });
      } catch (error) {
        console.log('The process failed with error: ' + error);
      }
    }
};



