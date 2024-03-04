import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { RecomendacionesService } from '../../shared/services/recomendations.service';
import { recomendaciones } from './recomendaciones';
import { ReservarService } from 'src/shared/services/reservar.service';
import { futureDateValidator } from './validator.date';
import  Swal from 'sweetalert2';
import { futureHourValidator } from './validatorHour';
import { ScheduleService } from 'src/shared/services/schedule.service';
@Component({
  selector: 'app-reserve-now',
  templateUrl: './reserve-now.component.html',
  styleUrls: ['./reserve-now.component.scss']
})


export class ReserveNowComponent implements OnInit, OnDestroy{
  public options: AnimationOptions = {
    path: '/assets/lottie-animations/reserve-recomendations.json',
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
      progressiveLoad: true
    }
  };

  reserveForm: FormGroup;
  recomendacionAleatoria: string = '';
  private intervalId: any;
  horarios: any[] = [];

  constructor(private fb: FormBuilder, private recomendacionesService: RecomendacionesService, 
    private reserveService: ReservarService, private schedule: ScheduleService) {
    this.reserveForm = this.fb.group({
      hora: ['', [Validators.required]],
      cantHoras: ['', [Validators.required, Validators.max(2), Validators.min(1)]],
      fecha_reserva: ['', [Validators.required, futureDateValidator()]]
    });

    this.initFormValidations();
    /*this.reserveForm.get('hora')!.setValidators([Validators.required, futureHourValidator(this.reserveForm)]);
    this.reserveForm.get('hora')!.updateValueAndValidity();*/
  }

  private initFormValidations() {
    const fechaReservaControl = this.reserveForm.get('fecha_reserva');
    this.reserveForm.get('hora')!.setValidators([
      Validators.required, 
      futureHourValidator(fechaReservaControl!)
    ]);

    // Asegúrate de actualizar la validación de 'hora' cuando 'fecha_reserva' cambie
    fechaReservaControl!.valueChanges.subscribe(() => {
      this.reserveForm.get('hora')!.updateValueAndValidity();
    });
  }
    // No es necesario suscribirse a los cambios de 'fecha_reserva' aquí,
    // ya que el validador ahora tiene acceso directo al control
  

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
            }).then((result) => {
              if(result.isConfirmed) {
                window.location.reload();
              }
            });
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
    this.getSchedule();
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

  getSchedule() {
    this.schedule.obtenerHorarios().subscribe({
      next: (response) => {
        if (response.success) {
          console.log(response.horarios);
          this.horarios = response.horarios;
        } else {
          console.error('Error al obtener los horarios');
        }
      },
      error: (error) => {
        console.error('Error al obtener los horarios', error);
      }
    });
  }

  formatHour(hourWithSeconds: string): string {
    // Extrae las horas y minutos
    const parts = hourWithSeconds.split(':');
    let hours = parseInt(parts[0], 10); // convierte en numero entero decimal (10)
    const minutes = parts[1];
    let suffix = 'AM';

    if (hours >= 12) {
      suffix = 'PM';
      hours = hours - 12;
    }
    if (hours === 0) {
      hours = 12; // La medianoche en formato 12h es 12 AM
    }

    // Devuelve el string formateado, asegurándose de que las horas sean dos dígitos. PadStart añade un '0' si es necesario.
    return hours.toString().padStart(2, '0') + ':' + minutes + ' ' + suffix;
  }
}
