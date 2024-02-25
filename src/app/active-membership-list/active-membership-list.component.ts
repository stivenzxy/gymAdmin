import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { apiConfig } from 'src/environments/api-config';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-active-membership-list',
  templateUrl: './active-membership-list.component.html',
  styleUrls: ['./active-membership-list.component.scss']
})
export class ActiveMembershipListComponent implements OnInit {
  membresias: any[] = [];

  constructor(private http: HttpClient){}

  ngOnInit(): void {
    this.obtenerMembresias();
  }

  obtenerMembresias() {
    this.http
      .get<{ success: boolean; membresias: any[] }>(
        `${apiConfig.baseUrl}GetMembresias/`
      )
      .subscribe({
        next: (response) => {
          if (response.success) {
            console.log(response.membresias);
            this.membresias = response.membresias;
          } else {
            console.error('Error al obtener las reservas');
          }
        },
        error: (error) => {
          console.error('Error al obtener las reservas', error);
        },
      });
  }

  cancelMembership(index:number) {
    const membresia = this.membresias[index];
    console.log(membresia.id_membresia);
    
    const body = {id_membresia: membresia.id_membresia};

    Swal.fire({
      title: '¿Deseas cancelar la membresia?',
      text: `El usuario ${membresia.usuario.nombre} perdera los beneficios premium`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Entendido',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.post(`${apiConfig.baseUrl}CancelMembresia/`, body).subscribe({
          next: (response: any) => {
            if (response.success) {
              Swal.fire({
                title: 'Membresia cancelada con exito!',
                text: 'Este usuario ya no hace parte del plan premium del gimnasio',
                confirmButtonText: 'Aceptar',
                icon: 'success',
              }).then((result) => {
                if (result.isConfirmed) {
                  this.membresias.splice(index, 1);
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
              title: 'Error al enviar los datos',
              text: error.error.message || 'Error desconocido',
              icon: 'error',
              confirmButtonText: 'Aceptar',
            });
          },
        });
      }
    });
  }
}
