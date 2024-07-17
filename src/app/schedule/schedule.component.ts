import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ScheduleService } from 'src/shared/services/schedule.service';
import Swal from 'sweetalert2';
import { DailySchedule, WeeklySchedule } from './schedule-data';
import { HttpDjangoResponse } from 'src/shared/models/responses/httpDjangoResponse';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent implements OnInit {
  weeklySchedule: WeeklySchedule = new WeeklySchedule();
  scheduleForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private scheduleService: ScheduleService
  ) {}

  ngOnInit() {
    this.initWeeklySchedule();
    this.newScheduleForm();
  }

  initWeeklySchedule() {
    const days = [
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
      'Domingo',
    ];
    this.weeklySchedule.schedules = days.map((day) => new DailySchedule(day));
  }

  private newScheduleForm() {
    this.scheduleForm = this.fb.group({
      days: this.fb.array(
        this.weeklySchedule.schedules.map((day) => {
          const dayFormGroup = this.fb.group({
            checkbox: [false],
            openTime: ['', Validators.required],
            closeTime: ['', Validators.required],
          });

          dayFormGroup.get('checkbox')!.valueChanges.subscribe((checked) => {
            if (checked) {
              dayFormGroup.get('openTime')!.clearValidators();
              dayFormGroup.get('closeTime')!.clearValidators();
            } else {
              dayFormGroup.get('openTime')!.setValidators(Validators.required);
              dayFormGroup.get('closeTime')!.setValidators(Validators.required);
            }
            dayFormGroup.get('openTime')!.updateValueAndValidity();
            dayFormGroup.get('closeTime')!.updateValueAndValidity();
          });

          return dayFormGroup;
        })
      ),
    });
  }

  get daysFormArray() {
    return this.scheduleForm.get('days') as FormArray;
  }

  submitNewSchedule() {
    const dayTranslationMap: { [key: string]: string } = {
      'Lunes': 'Monday',
      'Martes': 'Tuesday',
      'Miércoles': 'Wednesday',
      'Jueves': 'Thursday',
      'Viernes': 'Friday',
      'Sábado': 'Saturday',
      'Domingo': 'Sunday',
    };      

    console.log(this.scheduleForm.value);
    if (this.scheduleForm.valid) {
      const formValues = this.scheduleForm.value.days;
      this.weeklySchedule.schedules = formValues.map(
        (day: any, index: number) => {
          return {
            day: dayTranslationMap[this.weeklySchedule.schedules[index].day],
            closed: day.checkbox,
            open_time: day.checkbox ? null : day.openTime,
            close_time: day.checkbox ? null : day.closeTime,
          };
        }
      );

      console.log(this.weeklySchedule);

      const updatedSchedule = { updatedSchedule: this.weeklySchedule.schedules };

      Swal.fire({
        title: '¿Estás seguro?',
        text: 'El nuevo horario se verá reflejado al realizar una reserva, puedes cambiarlo despues si gustas',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Entendido',
        cancelButtonText: 'Cancelar',
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          this.scheduleService.updateSchedule(updatedSchedule).subscribe({
            next: (response: HttpDjangoResponse) => {
              if (response.success) {
                Swal.fire({
                  title: 'El horario se ha actualizado de manera exitosa!',
                  text: 'Esta acción se vera reflejada en el apartado de reservas',
                  confirmButtonText: 'Aceptar',
                  icon: 'success',
                  allowOutsideClick: false,
                }).then((result) => {
                  if (result.isConfirmed) {
                    window.location.reload();
                  }
                });
              } else {
                Swal.fire({
                  title: 'Error',
                  text: response.message || 'Ha ocurrido un error',
                  icon: 'error',
                  confirmButtonText: 'Aceptar',
                  allowOutsideClick: false,
                });
              }
            },
            error: (error: HttpDjangoResponse) => {
              Swal.fire({
                title: 'Error al enviar los datos',
                text: error.message || 'Error desconocido',
                icon: 'error',
                confirmButtonText: 'Aceptar',
                allowOutsideClick: false,
              });
            },
          });
        }
      });
    } else {
      this.daysFormArray.markAllAsTouched();
      this.daysFormArray.markAsDirty();
    }
  }
}