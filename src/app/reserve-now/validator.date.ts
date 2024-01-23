import { AbstractControl, ValidatorFn } from '@angular/forms';

export function futureDateValidator(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    var currentDate = new Date();

    if (!control.value) {
      return null;
    }

    var day = String(currentDate.getDate()).padStart(2, '0');
    var month = String(currentDate.getMonth() + 1).padStart(2, '0');
    var year = currentDate.getFullYear();

    const currentDateString = year + '-' + month + '-' + day;
    //console.log(currentDateString)
    //console.log(control.value)

    const isPastDate = control.value < currentDateString;

    return isPastDate ? { 'pastDate': { value: control.value } } : null;
  };
}
