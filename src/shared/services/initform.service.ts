import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { SharedService } from './shared.service'; // Asegúrate de que la ruta sea correcta
import { apiConfig } from 'src/environments/api-config';

@Injectable({
  providedIn: 'root'
})
export class InitformService {
<<<<<<< HEAD
  private apiUrl = 'http://127.0.0.1:8000/gym/CreateUser/';
=======
  private apiUrl = `${apiConfig.baseUrl}CreateUser/`;
>>>>>>> 2a5b9b21f6e9fe112540b1fd7a767e1b73a07f83

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
