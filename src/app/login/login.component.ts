import { Component, OnInit, OnDestroy } from '@angular/core';
import { GoogleAuthService } from '../../shared/services/googleAuth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { LoginService } from 'src/shared/services/login.service';
import { MatDialogRef } from '@angular/material/dialog';
import { LoginResponse } from 'src/shared/models/responses/loginResponse';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  hidePassword: boolean = true;

  constructor(
    private fb: FormBuilder,
    private preRegisterService: GoogleAuthService,
    private loginService: LoginService,
    private dialogRef: MatDialogRef<LoginComponent>
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {}
  ngOnDestroy(): void {}

  registerWithGoogle() {
    this.preRegisterService.registerWithGoogleProvider();
  }

  submitLoginInfo() {
    if (this.loginForm.valid) {
      this.loginService.submitLoginData(this.loginForm.value).subscribe({
        next: (response: LoginResponse) => {
          if (response.success) {
            const userRoleMessage = response.data.is_admin
              ? 'Bienvenido!, usted ha ingresado con privilegios de administrador'
              : 'Bienvenido!, usted ha ingresado como estudiante';
            this.dialogRef.close();
            Swal.fire({
              title: response.message,
              text: userRoleMessage,
              confirmButtonText: 'Aceptar',
              icon: 'success',
            });
          } else {
            Swal.fire({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              icon: 'error',
              title: response.message,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
              },
            });
          }
        },
        error: (error: LoginResponse) => {
          if (!error.success) {
            Swal.fire({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              icon: 'error',
              title: 'Usuario no encontrado.',
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
              },
            });
          } else {
            alert('Error de conexión con el servidor: ' + error.message);
          }
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
}
