import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReservarService {
  // aqui debe ir la ruta exacta de la funcion implementada en el backend, ejemplo: http://localhost:8000/reservar
  private apiUrl = 'http://backendUrl';


  constructor(private http: HttpClient) { }

  submitDataReserve(formData : any){
    console.log(formData);
    return this.http.post(this.apiUrl, formData);
  }

}

