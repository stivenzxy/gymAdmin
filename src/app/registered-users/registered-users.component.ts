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
    
    const body = {usuario};

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
        this.http.post('http://192.168.0.7:8000/gym/CrearAsistencia/', body).subscribe({
          next: (response: any) => {
            if (response.success) {
              Swal.fire({
                title: 'Asistencia agregada con exito!',
                text: `El usuario ${usuario.nombre} puede asistir al gimnasio ... ¡En este preciso Momento!`,
                confirmButtonText: 'Aceptar',
                icon: 'success',
              }).then((result) => {
                if (result.isConfirmed) {
                  //this.usuarios.splice(index, 1);
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
