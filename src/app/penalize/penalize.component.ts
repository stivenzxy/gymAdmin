import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ReservationData } from 'src/shared/models/entities/reservationData';
import { HttpDjangoResponse } from 'src/shared/models/responses/httpDjangoResponse';
import { ReservationResponse } from 'src/shared/models/responses/reservationResponse';
import { ReservationService } from 'src/shared/services/reservation.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-penalize',
  templateUrl: './penalize.component.html',
  styleUrls: ['./penalize.component.scss'],
})
export class PenalizeComponent implements OnInit, AfterViewInit {
  reservations: ReservationData[] = [];
  dataSource = new MatTableDataSource<ReservationData>();

  displayedColumns: string[] = [
    'studentCode',
    'program',
    'username',
    'reservationDate',
    'action',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private reservationService: ReservationService) {}

  ngOnInit(): void {
    this.getAllReservations();
    this.dataSource.filterPredicate = this.createFilter();
  }

  getAllReservations() {
    this.reservationService.getAllReserves().subscribe({
      next: (response: ReservationResponse) => {
        if (response.success) {
          console.log(response.reservations);
          this.dataSource.data = response.reservations;
          if (this.paginator && this.sort) {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }
          //this.reservations = response.reservations;
        } else {
          console.error('Error al obtener las reservas');
        }
      },
      error: (error: ReservationResponse) => {
        console.error('Error al obtener las reservas', error);
      },
    });
  }

  penalizeUser(data: ReservationData) {
    const reservation = data;
    const currentDate = new Date();
    const date = currentDate.toISOString().split('T')[0];

    console.log(reservation.reservation_id);
    console.log(date);

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer, si penalizas al usuario se perdera el registro de esta reserva.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Entendido',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.reservationService
          .penalizeUser(reservation.reservation_id, date)
          .subscribe({
            next: (response: HttpDjangoResponse) => {
              if (response.success) {
                Swal.fire({
                  title: 'La penalización se ha aplicado de manera exitosa',
                  text: 'Esta acción se vera reflejada en el perfil del cliente cuando intente reservar',
                  confirmButtonText: 'Aceptar',
                  icon: 'success',
                }).then(() => {
                  this.dataSource.data = this.dataSource.data.filter(
                    (r: ReservationData) =>
                      r.reservation_id !== data.reservation_id
                  );
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

  confirmAttendance(data: ReservationData) {
    const reservation = data;

    console.log(reservation.reservation_id);
    console.log(reservation);

    Swal.fire({
      title: '¿Estás seguro?',
      text:
        'Esta acción no se puede deshacer, estas confirmando la asistencia del usuario ' +
        reservation.user.username,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Entendido',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.reservationService
          .confirmAttendance(reservation.reservation_id)
          .subscribe({
            next: (response: HttpDjangoResponse) => {
              if (response.success) {
                Swal.fire({
                  title:
                    'El usuario ha sido añadido a las asistencias confirmadas',
                  text: 'Esto podra visualizarlo en el reporte de asistencias',
                  confirmButtonText: 'Aceptar',
                  icon: 'success',
                }).then(() => {
                  this.dataSource.data = this.dataSource.data.filter(
                    (r: ReservationData) =>
                      r.reservation_id !== data.reservation_id
                  );
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
                title: 'Algo ha salido mal al enviar los datos!',
                text: error.message || 'Error desconocido',
                icon: 'error',
                confirmButtonText: 'Aceptar',
              });
            },
          });
      }
    });
  }

  ngAfterViewInit() {
    if (this.dataSource.data.length) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  createFilter(): (data: ReservationData, filter: string) => boolean {
    return (data: ReservationData, filter: string): boolean => {
      const searchTerms = filter.trim().toLowerCase().split(' ');
      const dataStr =
        `${data.user.student_code} ${data.user.username}`.toLowerCase();

      return searchTerms.every((term) => dataStr.includes(term));
    };
  }
}
