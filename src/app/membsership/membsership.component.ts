import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GetUsersService } from 'src/shared/services/get-users.service';
import { MembershipService } from 'src/shared/services/membership.service';
import Swal from 'sweetalert2';
import { dateValidator } from './validatorDateMembership';
import { ActiveMembershipListComponent } from '../active-membership-list/active-membership-list.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-membsership',
  templateUrl: './membsership.component.html',
  styleUrls: ['./membsership.component.scss']
})
export class MembsershipComponent implements OnInit{
  membershipForm: FormGroup;

  constructor(private membershipService: MembershipService, private fb: FormBuilder,
    private getUserService: GetUsersService, private dialog : MatDialog){
    this.membershipForm = this.fb.group({
      fecha_inicio: ['', [Validators.required]],
      fecha_fin: ['', [Validators.required]],
      cod_estudiante: ['', [Validators.required]],
    });

    this.membershipForm.setValidators(dateValidator());
  }


  ngOnInit(): void {}  


  submitMembership() {
    if (this.membershipForm.valid) {
      const codEstudiante = this.membershipForm.get('cod_estudiante')!.value;
  
      this.getUserService.getUsers(codEstudiante).subscribe({
        next: (response) => {
          if (response && response.usuarios && response.usuarios.length > 0) {
            const usuario = response.usuarios[0];
            const username = usuario.nombre;
  
            this.confirmMembership(username);
          } else {
            Swal.fire({
              title: 'El codigo ingresado no esta registrado',
              text: `No se pudo encontrar un usuario con el código proporcionado. (${codEstudiante}), por favor verifique el codigo ingresado`,
              icon: 'error',
              confirmButtonText: 'Aceptar',
            });
          }
        },
        error: (error) => {
          Swal.fire({
            title: 'Error',
            text: 'Ocurrió un error al buscar el usuario: ' + error.message,
            icon: 'error',
            confirmButtonText: 'Aceptar',
          });
        }
      });
    } else {
      Object.keys(this.membershipForm.controls).forEach(field => {
        const control = this.membershipForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
    }
  }
  

  confirmMembership(username: string) {
      const membershipObservable = this.membershipService.submitMembership(this.membershipForm.value);
  
      Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer, estas agregando al usuario: ' + username + ' al plan premium',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Entendido',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if(result.isConfirmed && membershipObservable) {
          membershipObservable.subscribe({
            next: (response: any) => {
              if(response.success) {
                Swal.fire({
                  title: 'El usuario ha sido añadido a las membresias exitosamente',
                  text: 'Esto podra visualizarlo en el listado de usuarios premium',
                  confirmButtonText: 'Aceptar',
                  icon: 'success',
                }).then((result) => {
                  if(result.isConfirmed){
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
      this.openViewMembershipListModal();
    }

    openViewMembershipListModal() {
      const dialogRef = this.dialog.open(ActiveMembershipListComponent, {
        disableClose: true
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
    }
}
