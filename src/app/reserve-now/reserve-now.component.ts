import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { RecomendacionesService } from '../../shared/services/recomendations.service';
import { recomendaciones } from './recomendaciones';
import { ReservarService } from 'src/shared/services/reservar.service';
import { futureDateValidator } from './validator.date';
import  Swal from 'sweetalert2';
@Component({
  selector: 'app-reserve-now',
  templateUrl: './reserve-now.component.html',
  styleUrls: ['./reserve-now.component.scss']
})

/// Animacion de lottie
export class ReserveNowComponent implements OnInit, OnDestroy{
  public options: AnimationOptions = {
    path: '/assets/lottie-animations/reserve-recomendations.json',
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
      progressiveLoad: true
    }
  };
//////

  reserveForm: FormGroup;
  recomendacionAleatoria: string = '';
  private intervalId: any;

  constructor(private fb: FormBuilder, private recomendacionesService: RecomendacionesService, private reserveService: ReservarService) {
    this.reserveForm = this.fb.group({
      hora: ['', [Validators.required]],
      cantHoras: ['', [Validators.required, Validators.max(2), Validators.min(1)]],
      fecha_reserva: ['', [Validators.required, futureDateValidator()]]
    });
  }

  onSubmit() {
    if (this.reserveForm.valid) {
      const reservationObservable = this.reserveService.submitDataReserve(this.reserveForm.value);
  
      if (reservationObservable) {
        reservationObservable.subscribe({
          next: (response: any) => {
            if (response.success) { // success es la respuesta exitosa del backend
              Swal.fire({
                title: "Reserva realizada correctamente",
                text: "Continue navegando por nuestro sitio",
                confirmButtonText: "Aceptar",
                confirmButtonColor: '#1C36B5',
                icon: "success"
              }).then((result) => {
                if(result.isConfirmed) {
                  window.location.reload();
                }
              });;
            } else {
              Swal.fire({
                title: "Ups!....",
                text: response.message,
                confirmButtonText: "Aceptar",
                icon: "warning"
              });
            }
          },
          error: (error) => {
            Swal.fire({
              title: "Ups!...",
              text: error.error.message,
              confirmButtonText: "Aceptar",
              icon: "warning"
            })
          }
        });
      } else {
        Swal.fire({
          title: "Acceso Denegado",
          text: "Debes ser cliente e iniciar sesion con google para realizar una reserva.",
          confirmButtonText: "Aceptar",
          icon: "warning"
        });
      }
    } else {
      // Si el formulario no es válido, marca todos los controles como tocados para mostrar los mensajes de error
      Object.keys(this.reserveForm.controls).forEach(field => {
        const control = this.reserveForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
    }
  }
  
  ngOnInit() {
    this.intervalId = setInterval(() => this.cargarRecomendaciones(), 10000);
    this.cargarRecomendaciones();
  }

  cargarRecomendaciones(): void {
    const recomendacionesAleatorias = this.recomendacionesService.obtenerRecomendacionesAleatorias(recomendaciones, 1);;
    this.recomendacionAleatoria = recomendacionesAleatorias[0] || '¡Disfruta tu día!';
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  animationCreated(animationItem: AnimationItem): void { }
}
