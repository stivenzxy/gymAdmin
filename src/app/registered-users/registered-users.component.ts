import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { UserData } from 'src/shared/models/entities/userData';
import { HttpDjangoResponse } from 'src/shared/models/responses/httpDjangoResponse';
import { UserListResponse } from 'src/shared/models/responses/userListResponse';
import { GetUsersService } from 'src/shared/services/get-users.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registered-users',
  templateUrl: './registered-users.component.html',
  styleUrls: ['./registered-users.component.scss'],
})
export class RegisteredUsersComponent implements OnInit, AfterViewInit {
  dataSource = new MatTableDataSource<UserData>();

  displayedColumns: string[] = [
    'studentCode',
    'username',
    'phone',
    'program',
    'action',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private registeredUsersService: GetUsersService) {}

  ngOnInit(): void {
    this.getRegisteredUsers();
    this.dataSource.filterPredicate = this.createFilter();
  }

  getRegisteredUsers() {
    this.registeredUsersService.getAllUsers().subscribe({
      next: (response: UserListResponse) => {
        if (response.success) {
          console.log(response.userList);
          this.dataSource.data = response.userList;
          if (this.paginator && this.sort) {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }
        } else {
          console.error('Error al obtener los usuarios registrados');
        }
      },
      error: (error: UserListResponse) => {
        console.error('Error al obtener los usuarios registrados', error);
      },
    });
  }

  addAttendance(userToAdd: UserData) {
    console.log(userToAdd.username);

    Swal.fire({
      title: '¿Deseas Agregar una Asistencia sin Reserva?',
      text: 'Esto solo se puede realizar en caso de haber aforo disponible y si el usuario no realizó previamente',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Entendido',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Ingrese los datos requeridos (Hora y Cantidad de horas)',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Confirmar',
          cancelButtonText: 'Cancelar',
          html:
            '<input id="swal-input1" class="swal2-input w-[100%]" type="time" placeholder="Hora">' +
            '<input id="swal-input2" class="swal2-input" min="1" max="2" type="number" placeholder="Cantidad de horas">',
          focusConfirm: false,
          preConfirm: () => {
            const input1 = document.getElementById(
              'swal-input1'
            ) as HTMLInputElement;
            const input2 = document.getElementById(
              'swal-input2'
            ) as HTMLInputElement;

            const errors = [];
            const inputHour = input1.value;

            const currentTime = new Date().toTimeString().substring(0, 5);
            console.log(currentTime);
            console.log(inputHour);

            if (!inputHour) {
              errors.push('La hora es requerida.');
            } else if (inputHour < currentTime) {
              errors.push('La hora no puede ser menor que la hora actual.');
            }

            if (
              !input2.value ||
              parseInt(input2.value) < 1 ||
              parseInt(input2.value) > 2
            ) {
              errors.push('La cantidad de horas debe ser entre 1 y 2.');
            }

            if (errors.length > 0) {
              Swal.showValidationMessage(
                `<span style="font-weight:bold; margin-right: 1rem;">Errores:</span><br>${errors.join(
                  '<br>'
                )}`
              );
              return false; // Stop the operation
            }

            return {
              time: input1.value,
              hoursAmount: input2.value,
            };
          },
        }).then((result) => {
          if (result.value) {
            const dataForm = {
              user: userToAdd,
              time: result.value.time,
              hours_amount: result.value.hoursAmount,
            };

            console.log(dataForm);
            this.registeredUsersService
              .sendUserAttendanceData(dataForm)
              .subscribe({
                next: (response: HttpDjangoResponse) => {
                  console.log(response.message);
                  Swal.fire(
                    'Proceso Exitoso!',
                    `El usuario ${userToAdd.username} ha sido agregado al reporte de asistencias correctamente`,
                    'success'
                  );
                },
                error: (error: HttpDjangoResponse) => {
                  Swal.fire(
                    'Error',
                    `Error al enviar los datos ${error.message}`,
                    'error'
                  );
                },
              });
          }
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

  /** Filter table section */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  createFilter(): (data: UserData, filter: string) => boolean {
    return (data: UserData, filter: string): boolean => {
      const searchTerms = filter.trim().toLowerCase().split(' ');
      const dataStr =
        `${data.student_code} ${data.username} ${data.phone}`.toLowerCase();

      return searchTerms.every((term) => dataStr.includes(term));
    };
  }
}
