import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ReservationService } from 'src/shared/services/reservation.service';
import { LoginService } from 'src/shared/services/login.service';
import { HttpDjangoResponse } from 'src/shared/models/responses/httpDjangoResponse';
import { UserData } from 'src/shared/models/entities/userData';
import { ReservationData } from 'src/shared/models/entities/reservationData';
import { AttendanceData } from 'src/shared/models/entities/attendanceData';
@Component({
  selector: 'app-reserve-history',
  templateUrl: './reserve-history.component.html',
  styleUrls: ['./reserve-history.component.scss'],
})
export class ReserveHistoryComponent implements OnInit {
  reservationHistory: ReservationData[] = [];
  attendanceHistory: AttendanceData[] = [];
  uid: string | undefined;

  page: number = 1; // Current page
  pageSize: number = 5; // Items per page
  collectionSize!: number; // All history items

  constructor(
    private reservationService: ReservationService,
    private loginService: LoginService,
  ) {}

  get totalPage() {
    return Math.ceil(this.collectionSize / this.pageSize);
  }

  changePage(interval: number) {
    this.page += interval;
  }

  ngOnInit(): void {
    this.loginService.getLoggedUserData().subscribe((loggedUser: UserData) => {
      if (loggedUser) {
        this.uid = loggedUser.uid;
        this.getReservesPerUser(this.uid);
      }
    });
  }

  getReservesPerUser(uid: string | undefined) {
    this.reservationService.getAttendancesPerUser(uid).subscribe({
      next: (response) => {
        if (response.success) {
          console.log(response.attendances);
          this.reservationHistory = response.reservations;
          this.attendanceHistory = response.attendances;
          this.collectionSize = this.attendanceHistory.length;
        } else {
          console.error('Error al obtener las reservas');
        }
      },
      error: (error) => {
        console.error('Error al obtener las reservas', error);
      },
    });
  }

  cancelReserve(index: number) {
    const reserva = this.reservationHistory[index];
    console.log(reserva.reservation_id);

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
        this.reservationService.cancelReserve(reserva.reservation_id).subscribe({
          next: (response: HttpDjangoResponse) => {
            if (response.success) {
              Swal.fire({
                title: 'Reserva cancelada con exito!',
                text: 'Entendemos que en ocasiones no te sea posible asistir ;), pero evita cancelar reservas a ultimo minuto',
                confirmButtonText: 'Aceptar',
                icon: 'success',
              }).then((result) => {
                if (result.isConfirmed) {
                  this.reservationHistory.splice(index, 1);
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
          error: (error: HttpDjangoResponse) => {
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
