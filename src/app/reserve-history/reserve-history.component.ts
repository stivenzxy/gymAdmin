import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { AuthService } from 'src/shared/services/auth.service';
import Swal from 'sweetalert2';
import { apiConfig } from 'src/environments/api-config';
@Component({
  selector: 'app-reserve-history',
  templateUrl: './reserve-history.component.html',
  styleUrls: ['./reserve-history.component.scss']
})
export class ReserveHistoryComponent implements OnInit {
  historialReservas: any[] = [];
  historialAsistencias: any[] = [];
  uid: string | undefined ;

  page: number = 1; // Página actual
  pageSize: number = 5; // Cantidad de elementos por página
  collectionSize!: number; // Total de elementos en el historial

  constructor(private http : HttpClient, private authService: AuthService) {}


  get totalPage() {
    return Math.ceil(this.collectionSize / this.pageSize);
  }

  changePage(cambio: number) {
    this.page += cambio;
  }

  ngOnInit(): void {
    this.authService.user.subscribe(user => {
      if (user) {
        this.uid = user.uid;
        this.obtenerReservasPorUsuario(this.uid);
      }
    });
  }

  obtenerReservasPorUsuario(uid: string | undefined) {
<<<<<<< HEAD
    const url = `http://127.0.0.1:8000/gym/AsistenciasPerUser/?uid=${uid}`;
=======
    const url = `${apiConfig.baseUrl}AsistenciasPerUser/?uid=${uid}`;
>>>>>>> 2a5b9b21f6e9fe112540b1fd7a767e1b73a07f83
    this.http.get<{success: boolean, reservas: any[], asistencias: any[]}>(url).subscribe({
      next: (response) => {
        if (response.success) {
          console.log(response.reservas)
          this.historialReservas = response.reservas;
          this.historialAsistencias = response.asistencias;
          this.collectionSize = this.historialAsistencias.length;
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
    
    const body = {id_reserva: reserva.id_reserva};

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
<<<<<<< HEAD
        this.http.post('http://127.0.0.1:8000/gym/CancelReserva/', body).subscribe({
=======
        this.http.post(`${apiConfig.baseUrl}CancelReserva/`, body).subscribe({
>>>>>>> 2a5b9b21f6e9fe112540b1fd7a767e1b73a07f83
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
