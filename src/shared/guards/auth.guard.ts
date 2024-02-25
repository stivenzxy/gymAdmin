import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import Swal from 'sweetalert2';
import { DialogService } from '../guards/dialog.service';
import { LoginAdminService } from '../services/login-admin.service';

export const AuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  console.log('AuthGuard is running');
  const authService = inject(AuthService);
  const adminService = inject(LoginAdminService);
  const router = inject(Router);
  const dialog = inject(DialogService);

  const isAdminLoggedIn = adminService.isLoggedIn();

  // El guard debe activarse si no hay un administrador logueado.
  if (!isAdminLoggedIn) {
    guardAlert();
    //router.navigate(['dashboard']);
    return false; // Previene la navegación porque no hay un administrador logueado
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
            window.location.reload();
          }
        });
      } catch (error) {
        console.log('The process failed with error: ' + error);
      }
    }
};



