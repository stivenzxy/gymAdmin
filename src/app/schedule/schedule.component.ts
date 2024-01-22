import { Component, OnInit } from '@angular/core';
import { DailySchedule, WeeklySchedule } from './schedule-data';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {
  weeklySchedule: WeeklySchedule = new WeeklySchedule();
  scheduleForm!: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit() {
    this.initWeeklySchedule();
    this.initForm();
  }

  initWeeklySchedule() {
      const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
      this.weeklySchedule.schedules = days.map(day => new DailySchedule(day));
  }


  private initForm() {
    this.scheduleForm = this.fb.group({
        days: this.fb.array(this.weeklySchedule.schedules.map(day => {
            const dayFormGroup = this.fb.group({
                checkbox: [false],
                openTime: ['', Validators.required],
                closeTime: ['', Validators.required]
            });

            dayFormGroup.get('checkbox')!.valueChanges.subscribe(checked => {
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
        }))
    });
  }


  get daysFormArray() {
    return this.scheduleForm.get('days') as FormArray;
  }

  submitNewSchedule() {
    if (this.scheduleForm.valid) {
        const formValues = this.scheduleForm.value.days;
        this.weeklySchedule.schedules = formValues.map((day: any, index: number) => {
            return {
                day: this.weeklySchedule.schedules[index].day,
                closed: day.checkbox,
                openTime: day.checkbox ? null : day.openTime,
                closeTime: day.checkbox ? null : day.closeTime
            };
        });

        console.log(this.weeklySchedule);


        let updatedSchedule = this.weeklySchedule;

        Swal.fire({
          title: '¿Estás seguro?',
          text: 'El nuevo horario se verá reflejado al realizar una reserva, puedes cambiarlo despues si gustas',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Entendido',
          cancelButtonText: 'Cancelar',
          allowOutsideClick: false
        }).then((result) => {
          if(result.isConfirmed){
            this.http.post('http://127.0.0.1:8000/gym/ActualizarHorario/', updatedSchedule).subscribe({
              next: (response: any) => {
                if(response.success) {
                  Swal.fire({
                    title: 'El horario se ha actualizado de manera exitosa!',
                    text: 'Esta acción se vera reflejada en el apartado de reservas',
                    confirmButtonText: 'Aceptar',
                    icon: 'success',
                    allowOutsideClick: false
                  }).then((result) => {
                    if(result.isConfirmed) {
                      window.location.reload();
                    }
                  });
                } else {
                  Swal.fire({
                    title: 'Error',
                    text: response.message || 'Ha ocurrido un error',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                    allowOutsideClick: false
                  });
                }
              },
              error: (error) => {
                Swal.fire({
                  title: 'Error al enviar los datos',
                  text: error.error.message || 'Error desconocido',
                  icon: 'error',
                  confirmButtonText: 'Aceptar',
                  allowOutsideClick: false
                });
              },
            });
          }

        });

       
        //window.location.reload();
    } else {
        this.markAllAsTouched(this.daysFormArray);
    }
  }


  private markAllAsTouched(formGroup: FormGroup | FormArray) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markAllAsTouched(control);
      } else {
        control?.markAsTouched({ onlySelf: true });
      }
    });
  }
}
