import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ChangePasswordData } from 'src/shared/models/entities/changePasswordData';
import { UserData } from 'src/shared/models/entities/userData';
import { ChangePasswordResponse } from 'src/shared/models/responses/changePasswordResponse';
import { LoginService } from 'src/shared/services/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  loggedUserData!: UserData;

  constructor(private fb: FormBuilder, private loginService: LoginService) {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]+$/),
        ],
      ],
      confirmNewPassword: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loginService
      .getLoggedUserData()
      .subscribe((loggedUserData: UserData) => {
        if (loggedUserData) {
          this.loggedUserData = loggedUserData;
        }
      });
  }

  changePassword() {
    if (this.changePasswordForm.valid) {
      const formValues = this.changePasswordForm.value;
      const uid: string = this.loggedUserData.uid ?? '';

      const reservationFormData: ChangePasswordData = {
        uid: uid,
        current_password: formValues.currentPassword,
        new_password: formValues.newPassword,
        confirm_new_password: formValues.confirmNewPassword,
      };

      this.loginService.changePassword(reservationFormData).subscribe({
        next: (response: ChangePasswordResponse) => {
          if (response.success) {
            Swal.fire({
              title: response.message,
              text: 'Continua navegando por nuestro sitio',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#1C36B5',
              icon: 'success',
            }).then(() => {
              window.location.reload();
            });
          } else {
            Swal.fire({
              title: 'Ups!...',
              text: response.message,
              confirmButtonText: 'Aceptar',
              icon: 'warning',
            });
          }
        },
        error: (err) => {
          Swal.fire({
            title: 'Ups!...',
            text: err.error.message,
            confirmButtonText: 'Aceptar',
            icon: 'warning',
          });
        },
      });
    } else {
      this.changePasswordForm.markAllAsTouched();
      this.changePasswordForm.markAsDirty();
    }
  }
}
