import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-penalizar',
  templateUrl: './penalizar.component.html',
  styleUrls: ['./penalizar.component.scss']
})
export class PenalizarComponent implements OnInit{
  reservas: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.obtenerReservas();
  }

  obtenerReservas() {
    this.http.get<{success: boolean, reservas: any[]}>('http://192.168.0.8:8000/GetReservas/').subscribe({
      next: (response) => {
        if (response.success) {
          console.log(response.reservas)
          this.reservas = response.reservas;
        } else {
          console.error('Error al obtener las reservas');
        }
      },
      error: (error) => {
        console.error('Error al obtener las reservas', error);
      }
    });
  }
  

  penalizarUsuario(index: number) {
    const reserva = this.reservas[index];
    const fechaActual = new Date();
    const fecha = fechaActual.toISOString().split('T')[0];
  
    console.log(reserva.id_reserva)
    console.log(fecha)
    // fecha actual en la que se realiza la penalizacion
    const body = { id: reserva.id_reserva, fecha: fecha };
  
    this.http.post('http://192.168.0.8:8000/Penalizar/', body).subscribe({
      next: (response) => {
        console.log('Reserva penalizada con éxito', response);
        //this.reservas.splice(index, 1); // Elimina el usuario penalizado de la lista
      },
      error: (error) => {
        console.error('Error al penalizar la reserva', error);
      }
    });
  }
  
  
}
