import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { SharedService } from './shared.service'; // Asegúrate de que la ruta sea correcta

@Injectable({
  providedIn: 'root'
})
export class InitformService {
  private apiUrl = 'http://192.168.0.8:8000/CreateUser/';

  constructor(
    private http: HttpClient,
    private sharedService: SharedService
  ) { }

  submitExtraData(extraDataForm: any): Observable<any> {
    return this.sharedService.currentUser.pipe(
      switchMap(userData => {
        if (userData) {
          // Extraer datos específicos del objeto userData
          const { displayName, email, uid } = userData;
          // Suponiendo que 'programa' y 'codigo' están en extraDataForm
          const { programa, codigo } = extraDataForm;

          const dataToSend = {
            nombre: displayName,
            email: email,
            uid: uid,
            programa: programa,
            codigo: codigo
          };

          console.log(dataToSend)

          return this.http.post(this.apiUrl, dataToSend);
        } else {
          // Si no hay datos del usuario, puedes lanzar un error o manejarlo de otra manera
          throw new Error('Datos del usuario no disponibles');
        }
      })
    );
  }
}
