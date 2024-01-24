import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { AuthService } from 'src/shared/services/auth.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-reserve-history',
  templateUrl: './reserve-history.component.html',
  styleUrls: ['./reserve-history.component.scss']
})
export class ReserveHistoryComponent implements OnInit {
  historialReservas: any[] = [];
  historialAsistencias: any[] = [];
  uid: string | undefined ;

  constructor(private http : HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.user.subscribe(user => {
      if (user) {
        this.uid = user.uid;
        this.obtenerReservasPorUsuario(this.uid);
      }
    });
  }

  obtenerReservasPorUsuario(uid: string | undefined) {
    const url = `http://192.168.0.8:8000/gym/AsistenciasPerUser/?uid=${uid}`;
    this.http.get<{success: boolean, reservas: any[], asistencias: any[]}>(url).subscribe({
      next: (response) => {
        if (response.success) {
          console.log(response.reservas)
          this.historialReservas = response.reservas;
          this.historialAsistencias = response.asistencias;
        } else {
          console.error('Error al obtener las reservas');
        }
      },
      error: (error) => {
        console.error('Error al obtener las reservas', error);
      }
    });
  }
  
  cancelReserve(index: number){
    const reserva = this.historialReservas[index];
    console.log(reserva.id_reserva);
    
    const body = {id: reserva.id_reserva};

    Swal.fire({
      title: '¿Deseas cancelar la reserva?',
      text: 'Si vas al gimnasio no podras ingresar',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Entendido',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.post('http://192.168.0.8:8000/gym/CancelReserve/', body).subscribe({
          next: (response: any) => {
            if (response.success) {
              Swal.fire({
                title: 'Reserva cancelada con exito!',
                text: 'Entendemos que en ocasiones no te sea posible asistir ;), pero evita cancelar reservas a ultimo minuto',
                confirmButtonText: 'Aceptar',
                icon: 'success',
              }).then((result) => {
                if (result.isConfirmed) {
                  this.historialReservas.splice(index, 1);
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
