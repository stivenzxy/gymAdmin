import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { RecommendationService } from '../../shared/services/recomendations.service';
import { recommendations } from './recommendations';
import { ReservationService } from 'src/shared/services/reservation.service';
import { futureDateValidator } from './validator.date';
import Swal from 'sweetalert2';
import { futureHourValidator } from './validatorHour';
import { ScheduleService } from 'src/shared/services/schedule.service';
import { ScheduleResponse } from 'src/shared/models/responses/scheduleResponse';
import { Schedule } from 'src/shared/models/entities/scheduleData';
import { ReservationData } from 'src/shared/models/entities/reservationData';
import { NewReservation } from 'src/shared/models/entities/newReservation';
import { HttpDjangoResponse } from 'src/shared/models/responses/httpDjangoResponse';
@Component({
  selector: 'app-reserve-now',
  templateUrl: './reserve-now.component.html',
  styleUrls: ['./reserve-now.component.scss'],
})

export class ReserveNowComponent implements OnInit, OnDestroy {
  public options: AnimationOptions = {
    path: '/assets/lottie-animations/reserve-recomendations.json',
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
      progressiveLoad: true,
    },
  };

  reserveForm: FormGroup;
  randomRecomendation: string = '';
  private intervalId: number | undefined;
  schedules: Schedule[] = [];

  constructor(
    private fb: FormBuilder,
    private recommendationService: RecommendationService,
    private reservationService: ReservationService,
    private scheduleService: ScheduleService
  ) {
    this.reserveForm = this.fb.group({
      reservationTime: ['', [Validators.required]],
      hoursAmount: [
        '',
        [Validators.required, Validators.max(2), Validators.min(1)],
      ],
      reservationDate: ['', [Validators.required, futureDateValidator()]],
    });

    this.initFormValidations();
  }

  private initFormValidations() {
    const reservationDateControl = this.reserveForm.get('reservationDate');
    this.reserveForm
      .get('reservationTime')!
      .setValidators([
        Validators.required,
        futureHourValidator(reservationDateControl!),
      ]);

    reservationDateControl!.valueChanges.subscribe(() => {
      this.reserveForm.get('reservationTime')!.updateValueAndValidity();
    });
  }

  submitNewReserve() {
    if (this.reserveForm.valid) {
      const formValues = this.reserveForm.value;

      const reservationFormData: NewReservation = {
        reservation_time: formValues.reservationTime,
        reservation_date: formValues.reservationDate,
        hours_amount: formValues.hoursAmount,
      };

      const reservationObservable =
        this.reservationService.submitDataReserve(reservationFormData);

      if (reservationObservable) {
        reservationObservable.subscribe({
          next: (response: HttpDjangoResponse) => {
            if (response.success) {
              Swal.fire({
                title: 'Reserva realizada correctamente',
                text: 'Continue navegando por nuestro sitio',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#1C36B5',
                icon: 'success',
              }).then((result) => {
                if (result.isConfirmed) {
                  window.location.reload();
                }
              });
            } else {
              Swal.fire({
                title: 'Ups!....',
                text: response.message,
                confirmButtonText: 'Aceptar',
                icon: 'warning',
              });
            }
          },
          error: (error) => {
            Swal.fire({
              title: 'Ups!...',
              text: error.error.message,
              confirmButtonText: 'Aceptar',
              icon: 'warning',
            }).then((result) => {
              if (result.isConfirmed) {
                window.location.reload();
              }
            });
          },
        });
      } else {
        Swal.fire({
          title: 'Acceso Denegado',
          text: 'Debes ser cliente e iniciar sesion con google para realizar una reserva.',
          confirmButtonText: 'Aceptar',
          icon: 'warning',
        });
      }
    } else {
      this.reserveForm.markAllAsTouched();
    }
  }

  ngOnInit(): void {
    this.intervalId = window.setInterval(
      () => this.loadRecommendations(),
      10000
    );
    this.loadRecommendations();
    this.getSchedule();
  }

  loadRecommendations(): void {
    const randomRecommendations =
      this.recommendationService.getRandomRecommendations(recommendations, 1);
    this.randomRecomendation = randomRecommendations[0] || '¡Disfruta tu día!';
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  animationCreated(animationItem: AnimationItem): void {}

  getSchedule() {
    const dayTranslationMap: { [key: string]: string } = {
      Monday: 'Lunes',
      Tuesday: 'Martes',
      Wednesday: 'Miércoles',
      Thursday: 'Jueves',
      Friday: 'Viernes',
      Saturday: 'Sábado',
      Sunday: 'Domingo',
    };

    this.scheduleService.getSchedule().subscribe({
      next: (response: ScheduleResponse) => {
        if (response.success) {
          const translatedSchedules = response.schedules.map(
            (schedule: Schedule) => {
              return {
                ...schedule,
                day: dayTranslationMap[schedule.day] || schedule.day,
              };
            }
          );

          this.schedules = translatedSchedules;
        } else {
          console.error('Error al obtener los horarios');
        }
      },
      error: (error: ScheduleResponse) => {
        console.error('Error al obtener los horarios', error);
      },
    });
  }

  formatHour(hourWithSeconds: string): string {
    const parts = hourWithSeconds.split(':');
    let hours = parseInt(parts[0], 10);
    const minutes = parts[1];
    let suffix = 'AM';

    if (hours >= 12) {
      suffix = 'PM';
      hours = hours - 12;
    }
    if (hours === 0) {
      hours = 12; //
    }

    // Returns the formated string, ensuring that the hours are two digits. PadStart adds '0' if is necessary.
    return hours.toString().padStart(2, '0') + ':' + minutes + ' ' + suffix;
  }
}
