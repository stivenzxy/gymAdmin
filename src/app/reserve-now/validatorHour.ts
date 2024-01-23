import { FormGroup, ValidatorFn, AbstractControl } from '@angular/forms';

export function futureHourValidator(fechaReservaControl: AbstractControl): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {

    console.log('Validador ejecutándose');
    const currentTime = new Date();

    //console.log(form.value)
    

    const hours = String(currentTime.getHours()).padStart(2, '0');
    const minutes = String(currentTime.getMinutes()).padStart(2, '0');

    const currentTimeString = `${hours}:${minutes}`;

    if (!control.value) {
      return null;
    }

    // Validar que sean horas con minutos HH:00 || HH:30
    const validMinutesFormat = control.value.endsWith(':00') || control.value.endsWith(':30');
    if (!validMinutesFormat) {
      return { 'invalidMinuteFormat': { value: control.value } };
    }
    
    // Aquí accedemos al valor de 'fecha_reserva'
    const fechaReserva = fechaReservaControl.value;
    if (fechaReserva) {
      console.log('fecha de reserva en el validador de hora: ', fechaReserva)
    }

    var day = String(currentTime.getDate()).padStart(2, '0');
    var month = String(currentTime.getMonth() + 1).padStart(2, '0');
    var year = currentTime.getFullYear();

    const currentDateString = year + '-' + month + '-' + day;

    const isPastTime = fechaReserva <= currentDateString && control.value < currentTimeString;

    return isPastTime ? { 'pastTime': { value: control.value } } : null;
  };
}
