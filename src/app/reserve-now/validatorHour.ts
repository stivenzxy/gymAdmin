import { FormGroup, ValidatorFn, AbstractControl } from '@angular/forms';

export function futureHourValidator(reservationDateControl: AbstractControl): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {

    console.log('Hour Validator is running!');
    const currentTime = new Date();

    const hours = String(currentTime.getHours()).padStart(2, '0');
    const minutes = String(currentTime.getMinutes()).padStart(2, '0');

    const currentTimeString = `${hours}:${minutes}`;

    if (!control.value) {
      return null;
    }

    // Validate that they are hours with minutes HH:00 || HH:30
    const validMinutesFormat = control.value.endsWith(':00') || control.value.endsWith(':30');
    if (!validMinutesFormat) {
      return { 'invalidMinuteFormat': { value: control.value } };
    }
    
    const reservationDate = reservationDateControl.value;
    if (reservationDate) {
      console.log('Reservation date in hour validator: ', reservationDate)
    }

    var day = String(currentTime.getDate()).padStart(2, '0');
    var month = String(currentTime.getMonth() + 1).padStart(2, '0');
    var year = currentTime.getFullYear();

    const currentDateString = year + '-' + month + '-' + day;

    const isPastTime = reservationDate <= currentDateString && control.value < currentTimeString;

    return isPastTime ? { 'pastTime': { value: control.value } } : null;
  };
}