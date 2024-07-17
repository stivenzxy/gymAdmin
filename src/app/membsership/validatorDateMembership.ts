import { AbstractControl, FormGroup, ValidatorFn } from '@angular/forms';

export function dateValidator(): ValidatorFn {
  return (form: AbstractControl): { [key: string]: any } | null => {
    if (form instanceof FormGroup) {
      const startDate = form.get('startDate')?.value;
      const endDate = form.get('endDate')?.value;
      const currentDate = new Date();

      const formatDate = (date: Date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
      };

      const currentDateString = formatDate(currentDate);

      if (startDate) {
        console.log('current date: ', currentDateString);
        console.log('start date: ', startDate);

        if (startDate < currentDateString) {
          console.log('start date less than current date');
          return { startMoreThanCurrent: { value: startDate } };
        }
      }

      if (startDate && endDate) {
        console.log('end date: ', endDate);

        if (startDate > endDate) {
          return { startMoreThanEnd: { value: startDate } };
        }
      }
    }
    return null;
  };
}
