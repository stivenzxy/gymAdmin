import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { AuthService } from 'src/shared/services/auth.service';
@Component({
  selector: 'app-reserve-history',
  templateUrl: './reserve-history.component.html',
  styleUrls: ['./reserve-history.component.scss']
})
export class ReserveHistoryComponent implements OnInit {
  historial: any[] = [];
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
    const url = `http://192.168.0.8:8000/ReservasPerUser/?uid=${uid}`;
    this.http.get<{success: boolean, reservas: any[]}>(url).subscribe({
      next: (response) => {
        if (response.success) {
          console.log(response.reservas)
          this.historial = response.reservas;
        } else {
          console.error('Error al obtener las reservas');
        }
      },
      error: (error) => {
        console.error('Error al obtener las reservas', error);
      }
    });
  }
  
}
