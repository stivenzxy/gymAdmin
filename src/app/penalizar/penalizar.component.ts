import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-penalizar',
  templateUrl: './penalizar.component.html',
  styleUrls: ['./penalizar.component.scss'],
})
export class PenalizarComponent implements OnInit {
  reservas: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.obtenerReservas();
  }

  obtenerReservas() {
    this.http
      .get<{ success: boolean; reservas: any[] }>(
        'http://172.17.212.196:8000/GetReservas/'
      )
      .subscribe({
        next: (response) => {
          if (response.success) {
            console.log(response.reservas);
            this.reservas = response.reservas;
          } else {
            console.error('Error al obtener las reservas');
          }
        },
        error: (error) => {
          console.error('Error al obtener las reservas', error);
        },
      });
  }

  penalizarUsuario(index: number) {
    const reserva = this.reservas[index];
    const fechaActual = new Date();
    const fecha = fechaActual.toISOString().split('T')[0];

    console.log(reserva.id_reserva);
    console.log(fecha);
    // fecha actual en la que se realiza la penalizacion
    const body = { id: reserva.id_reserva, fecha: fecha };

    //console.log('Reserva penalizada con éxito', response);
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Entendido',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.post('http://172.17.212.196:8000/Penalizar/', body).subscribe({
          next: (response: any) => {
            // Manejo de la respuesta exitosa
            if (response.success) {
              //console.log('Datos enviados correctamente!');
              Swal.fire({
                title: 'La penalización se ha aplicado de manera exitosa',
                text: 'Esta acción se vera reflejada en el perfil del cliente cuando intente reservar',
                confirmButtonText: 'Aceptar',
                icon: 'success',
              }).then((result) => {
                if (result.isConfirmed) {
                  window.location.reload();
                }
              });
            } else {
              // Manejo de una respuesta no exitosa del servidor
              Swal.fire({
                title: 'Error',
                text: response.message || 'Ha ocurrido un error',
                icon: 'error',
                confirmButtonText: 'Aceptar',
              });
            }
          },
          error: (error) => {
            // Manejo de errores de conexión o del lado del cliente
            Swal.fire({
              title: 'Error al enviar los datos',
              text: error.message || 'Error desconocido',
              icon: 'error',
              confirmButtonText: 'Aceptar',
            });
          },
        });
      }
    });
  }
}
