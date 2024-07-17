import { Component, OnDestroy, OnInit } from '@angular/core';
import { GoogleAuthService } from 'src/shared/services/googleAuth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisterService } from 'src/shared/services/register.service';
import Swal from 'sweetalert2';
import { Schools } from './programs.helper';
import { MatDialogRef } from '@angular/material/dialog';
import { School } from 'src/shared/models/entities/school';
import { HttpDjangoResponse } from 'src/shared/models/responses/httpDjangoResponse';
import { RegisterUserData } from 'src/shared/models/entities/register.extraData';
@Component({
  selector: 'app-initform',
  templateUrl: './initform.component.html',
  styleUrls: ['./initform.component.scss'],
})
export class InitformComponent implements OnInit, OnDestroy {
  schools: School[] = Schools;
  registerNewUserForm: FormGroup;
  hidePassword: boolean = true;

  constructor(
    private fb: FormBuilder,
    private registerService: RegisterService,
    private preRegisterService: GoogleAuthService,
    public InitdialogRef: MatDialogRef<InitformComponent>
  ) {
    this.registerNewUserForm = this.fb.group({
      program: ['', [Validators.required]],
      studentCode: ['', [Validators.required]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]+$/),
        ],
      ],
    });
  }

  submitRegisterData() {
    if (this.registerNewUserForm.valid) {
      const formValues = this.registerNewUserForm.value;

      const body: RegisterUserData = {
        program: formValues.program,
        student_code: formValues.studentCode,
        password: formValues.password,
      };

      Swal.fire({
        title: '¿Estás seguro?',
        text: 'Puedes corregir estos datos posteriormente en caso de que alguno sea erroneo.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Registrarme',
        cancelButtonText: 'Cancelar Registro',
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          this.registerService.registerUser(body).subscribe({
            next: (response: HttpDjangoResponse) => {
              if (response.success) {
                console.log('Datos enviados correctamente!');
                Swal.fire({
                  title: 'Su cuenta ha sido registrada con exito',
                  text: 'Por favor inicie sesión con su correo y contraseña registrados.',
                  confirmButtonColor: '#294C77',
                  confirmButtonText: 'Ir al Login',
                  icon: 'success',
                }).then(() => {
                  this.closeInitDialog();
                  this.preRegisterService.logOut();
                  this.preRegisterService.logoutSubject.next();
                });
              } else {
                Swal.fire({
                  title: 'Ups!...Error',
                  text: response.message || 'Ha ocurrido un error',
                  icon: 'error',
                  confirmButtonText: 'Aceptar',
                }).then(() => {
                  this.preRegisterService.logOut();
                  this.preRegisterService.logoutSubject.next();
                });
              }
            },
            complete: () => {
              console.log('Solicitud completada');
            },
          });
        }
      });
    } else {
      this.registerNewUserForm.markAllAsTouched();
      this.registerNewUserForm.markAsDirty();
    }
  }

  closeInitDialog() {
    this.InitdialogRef.close('Dialog Closed');
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  ngOnInit(): void {}
  ngOnDestroy(): void {}
}
