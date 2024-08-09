import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ResetPasswordEmailService } from 'src/shared/services/reset-password-email.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit{
  resetPasswordForm: FormGroup;
  uid!: string;
  token!: string;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private resetPasswordService: ResetPasswordEmailService
  ) {
    this.resetPasswordForm = this.fb.group({
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
    this.uid = this.route.snapshot.queryParamMap.get('uid') ?? "";
    this.token = this.route.snapshot.queryParamMap.get('token') ?? "";
  }

  resetPassword(): void {
    if (this.resetPasswordForm.valid) {
      const { newPassword, confirmNewPassword } = this.resetPasswordForm.value;

      if (newPassword === confirmNewPassword) {
        this.resetPasswordService.resetPassword(this.uid, this.token, newPassword, confirmNewPassword)
          .subscribe({
            next: (response) => {
              Swal.fire('¡Éxito!', response.message, 'success');
            },
            error: (error) => {
              Swal.fire('Error', error.error.message, 'error');
            }
          });
      } else {
        Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
      }
    } else {
      this.resetPasswordForm.markAllAsTouched();
      this.resetPasswordForm.markAsDirty();
    }
  }
}
