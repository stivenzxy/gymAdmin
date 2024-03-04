import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { GetUsersService } from 'src/shared/services/get-users.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registered-users',
  templateUrl: './registered-users.component.html',
  styleUrls: ['./registered-users.component.scss']
})
export class RegisteredUsersComponent implements OnInit{
  usuarios: any[] = [];
  searchText = '';
  hasSearchResults: boolean = true;
  filteredUsers!: any[];

  constructor(private registeredUsersService : GetUsersService, private http: HttpClient) { }

  ngOnInit(): void {
    this.obtenerUsuariosRegistrados();
  }

  obtenerUsuariosRegistrados() {
    this.registeredUsersService.getUsersWithoutCod().subscribe({
      next: (response) => {
        if(response.success) {
          console.log(response.usuarios)
          this.usuarios = response.usuarios;
        } else {
          console.error('Error al obtener los usuarios registrados');
        }
      },
      error: (error) => {
        console.error('Error al obtener los usuarios registrados', error);
      }
    })
  }

  
  onSearch() {
    if (!this.searchText) {
      this.filteredUsers = [...this.usuarios];
      this.hasSearchResults = true;
    } else {
      this.filteredUsers = this.usuarios.filter(usuario => 
        JSON.stringify(usuario).toLowerCase().includes(this.searchText.toLowerCase())
      );
      this.hasSearchResults = this.filteredUsers.length > 0;
    }
  }

  addAttendance(index:number) {
    const usuario = this.usuarios[index];
    console.log(usuario.nombre);

    Swal.fire({
      title: '¿Deseas Agregar una Asistencia sin Reserva?',
      text: 'Esto solo se realiza en caso de haber aforo disponible y si un usuario no reservó previamente',
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
           // '<input id="swal-input1" class="swal2-input" type="date" placeholder="Fecha">' +
            '<input id="swal-input1" class="swal2-input w-[100%]" type="time" placeholder="Hora">' +
            '<input id="swal-input2" class="swal2-input" min="1" max="2" type="number" placeholder="Cantidad de horas">',
          focusConfirm: false,
          preConfirm: () => {
            //const input1 = document.getElementById('swal-input1') as HTMLInputElement;
            const input1 = document.getElementById('swal-input1') as HTMLInputElement;
            const input2 = document.getElementById('swal-input2') as HTMLInputElement;

            // Validaciones
            const errores = [];
            const inputHour = input1.value;

            var currentTime = new Date().toTimeString().substring(0, 5);
            console.log(currentTime)
            console.log(inputHour)

            if (!inputHour) {
              errores.push("La hora es requerida.");
            } else if (inputHour < currentTime) {
              errores.push("La hora no puede ser menor que la hora actual.");
            }

            if (!input2.value || parseInt(input2.value) < 1 || parseInt(input2.value) > 2) {
              errores.push("La cantidad de horas debe ser entre 1 y 2.");
            }
          

            if (errores.length > 0) {
              Swal.showValidationMessage(
                `<span style="font-weight:bold; margin-right: 1rem;">Errores:</span><br>${errores.join('<br>')}`
              );
              return false; // Detiene el proceso
            }
        
            return {
              //fecha: input1.value,
              hora: input1.value,
              cantidad_horas: input2.value
            };
          }
        }).then((result) => {
          if (result.value) {
            const dataForm = {
              usuario: usuario, 
              hora: result.value.hora,
              cantidad_horas: result.value.cantidad_horas,
            };

            console.log(dataForm);
            this.registeredUsersService.sendUserAttendanceData(dataForm).subscribe({
              next: (response : any) => {
                console.log(response);
                Swal.fire('Proceso Exitoso!', `El usuario ${usuario.nombre} ha sido agregado al reporte de asistencias correctamente`, 'success');
              },
              error: (error) => {
                Swal.fire('Error', `Error al enviar los datos ${error.error.message}`, 'error');
              }
            })
          }
        });
        
      }
    });
  }
}
