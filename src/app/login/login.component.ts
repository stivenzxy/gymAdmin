import { Component, OnInit, OnDestroy } from '@angular/core';
import { GoogleAuthService } from '../../shared/services/googleAuth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { LoginService } from 'src/shared/services/login.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoginResponse } from 'src/shared/models/responses/loginResponse';
import { ResetPasswordEmailService } from 'src/shared/services/reset-password-email.service';
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
    private resetPasswordService: ResetPasswordEmailService,
    private dialogRef: MatDialogRef<LoginComponent>,
    private dialog: MatDialog
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

  sendRecoveryPasswordEmail() {
    this.dialogRef.close();

    Swal.fire({
      title: 'Ingrese su correo electrónico',
      input: 'email',
      inputPlaceholder: 'usuario@unillanos.com',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: (email) => {
        Swal.showLoading();
        return new Promise((resolve, reject) => {
          this.resetPasswordService.requestResetPasswordCode(email).subscribe({
            next: (response) => {
              Swal.hideLoading();
              resolve(response);
            },
            error: (error) => {
              Swal.hideLoading();
              reject(new Error(error.error.message));
            }
          });
        }).then((response: any) => {
          Swal.fire('Correo Enviado Exitosamente!', `${response.message}`, 'success');
        }).catch(error => {
          Swal.fire('Error', error.message, 'error');
        });
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.cancel) {
        this.openLoginDialog();
      }
    });
  }

  openLoginDialog() {
    this.dialog.open(LoginComponent);
  }
}
