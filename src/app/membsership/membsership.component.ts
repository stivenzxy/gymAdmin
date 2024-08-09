import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GetUsersService } from 'src/shared/services/get-users.service';
import { MembershipService } from 'src/shared/services/membership.service';
import Swal from 'sweetalert2';
import { dateValidator } from './validatorDateMembership';
import { ActiveMembershipListComponent } from '../active-membership-list/active-membership-list.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NewMembership } from 'src/shared/models/entities/newMembership';
import { UserData } from 'src/shared/models/entities/userData';
import { UserListResponse } from 'src/shared/models/responses/userListResponse';
import { HttpDjangoResponse } from 'src/shared/models/responses/httpDjangoResponse';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-membsership',
  templateUrl: './membsership.component.html',
  styleUrls: ['./membsership.component.scss'],
})
export class MembsershipComponent implements OnInit {
  membershipForm: FormGroup;

  constructor(
    private membershipService: MembershipService,
    private fb: FormBuilder,
    private getUserService: GetUsersService,
    private dialog: MatDialog,
    private dialogMembershipRef: MatDialogRef<MembsershipComponent>
  ) {
    this.membershipForm = this.fb.group({
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      studentCode: ['', [Validators.required]],
    });

    this.membershipForm.setValidators(dateValidator());
  }

  ngOnInit(): void {
    console.log('Membership Component is running!');
  }

  createMembership() {
    if (this.membershipForm.valid) {
      const studentCode = this.membershipForm.get('studentCode')!.value;

      this.getUserService.getUserWithStudentCode(studentCode).subscribe({
        next: (response: UserListResponse) => {
          if (response && response.userList && response.userList.length > 0) {
            const user: UserData = response.userList[0];
            const username: string = user.username ?? '';

            this.confirmMembership(username);
          } else {
            Swal.fire({
              title: 'El codigo ingresado no esta registrado',
              text: `No se pudo encontrar un usuario con el código proporcionado. (${studentCode}), por favor verifique el codigo ingresado`,
              icon: 'error',
              confirmButtonText: 'Aceptar',
            });
          }
        },
        error: (error: HttpDjangoResponse) => {
          Swal.fire({
            title: 'Error',
            text: 'Ocurrió un error al buscar el usuario: ' + error.message,
            icon: 'error',
            confirmButtonText: 'Aceptar',
          });
        },
      });
    } else {
      this.membershipForm.markAllAsTouched();
      this.membershipForm.markAsDirty();
    }
  }

  confirmMembership(username: string) {
    const formValues = this.membershipForm.value;

    const body: NewMembership = {
      start_date: formValues.startDate,
      end_date: formValues.endDate,
      student_code: formValues.studentCode,
    };

    const membershipObservable: Observable<HttpDjangoResponse> =
      this.membershipService.createNewMembership(body);

    Swal.fire({
      title: '¿Estás seguro?',
      text:
        'Esta acción no se puede deshacer, estas agregando al usuario: ' +
        username +
        ' al plan premium',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Entendido',
      cancelButtonText: 'Cancelar',
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed && membershipObservable) {
        membershipObservable.subscribe({
          next: (response: any) => {
            if (response.success) {
              Swal.fire({
                title:
                  'El usuario ha sido añadido a las membresias exitosamente',
                text: 'Esto podra visualizarlo en el listado de usuarios premium',
                confirmButtonText: 'Aceptar',
                icon: 'success',
              }).then((result) => {
                if (result.isConfirmed) {
                  window.location.reload();
                }
              });
            } else {
              Swal.fire({
                title: 'Error',
                text: response.message || 'Ha ocurrido un error',
                icon: 'error',
                confirmButtonText: 'Aceptar',
              });
            }
          },
          error: (error) => {
            Swal.fire({
              title: 'Ups...!',
              text: error.error.message,
              icon: 'error',
              confirmButtonText: 'Aceptar',
            });
          },
        });
      }
    });
  }

  viewMembershipList() {
    this.dialogMembershipRef.close();
    this.openViewMembershipListModal();
  }

  openViewMembershipListModal() {
    const dialogRef = this.dialog.open(ActiveMembershipListComponent, {
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
