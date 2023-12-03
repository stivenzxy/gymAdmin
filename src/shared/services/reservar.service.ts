import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class ReservarService {
  private apiUrl = 'http://192.168.0.8:8000/CreateReserva/';
  private currentUser: string | null = null;

  constructor(
    private http: HttpClient,
    private sharedService: SharedService
  ) {
    // Suscribirse al UID actualizado
    this.sharedService.currentUser.subscribe(user => {
      if (user && user.uid) {
        this.currentUser = user.uid;
      } else {
        this.currentUser = null;
      }
    });
  }

  submitDataReserve(formData: any) {
    var currentDate = new Date();

    var day = String(currentDate.getDate()).padStart(2, '0');
    var month = String(currentDate.getMonth() + 1).padStart(2, '0');
    var year = currentDate.getFullYear();

    const currentDateString = year + '-' + month + '-' + day;

    if (this.currentUser) {
      const dataWithUid = { ...formData, uid: this.currentUser, fecha_actual: currentDateString};
      console.log(dataWithUid);
      return this.http.post(this.apiUrl, dataWithUid);
    } else {
      // Manejar el caso en que el UID no esté disponible
      console.error('No se puede enviar la reserva: UID no disponible');
      return undefined;
    }
  }
}
