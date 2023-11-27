import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RecomendacionesService {
  constructor() { }

  obtenerRecomendacionesAleatorias(recomendaciones: string[], cantidad: number): string[] {
    const mezcladas = [...recomendaciones].sort(() => 0.5 - Math.random());
    return mezcladas.slice(0, cantidad);
  }
}
