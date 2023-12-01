import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class ReservarService {
  private apiUrl = 'http://172.17.213.169:8000/CreateReserva/';
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
    if (this.currentUser) {
      const dataWithUid = { ...formData, uid: this.currentUser };
      console.log(dataWithUid);
      return this.http.post(this.apiUrl, dataWithUid);
    } else {
      // Manejar el caso en que el UID no esté disponible
      console.error('No se puede enviar la reserva: UID no disponible');
      return undefined;
    }
  }
}
