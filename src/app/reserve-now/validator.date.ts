import { AbstractControl, ValidatorFn } from '@angular/forms';

export function futureDateValidator(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const currentDate = new Date();
    const tomorrowDate = new Date();
    tomorrowDate.setDate(currentDate.getDate() + 1);

    if (!control.value) {
      return null;
    }

    const formatDate = (date: Date) => {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    };

    const currentDateString = formatDate(currentDate);
    const tomorrowDateString = formatDate(tomorrowDate);

    const isDayLimit = control.value > tomorrowDateString;
    const isPastDate = control.value < currentDateString;

    if (isDayLimit) {
      return { 'dayLimit': { value: control.value } };
    }

    if (isPastDate) {
      return { 'pastDate': { value: control.value } };
    }

    return null;
  };
}