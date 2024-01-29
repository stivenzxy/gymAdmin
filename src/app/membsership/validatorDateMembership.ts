import { AbstractControl, FormGroup, ValidatorFn } from '@angular/forms';

export function dateValidator(): ValidatorFn {
  return (form: AbstractControl): { [key: string]: any } | null => {
    if (form instanceof FormGroup) {
      const fecha_inicio = form.get('fecha_inicio')?.value;
      const fecha_fin = form.get('fecha_fin')?.value;
      const currentDate = new Date();

      const formatDate = (date: Date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
      };

      const currentDateString = formatDate(currentDate);

      // Si fecha_inicio está definida, comprobar si es anterior a la fecha actual.
      if (fecha_inicio) {
        console.log('fecha actual: ', currentDateString);
        console.log('fecha inicio: ', fecha_inicio);

        if (fecha_inicio < currentDateString) {
          console.log('fecha inicial inferior a la actual');
          return { 'startMoreThanCurrent': { value: fecha_inicio } };
        }
      }

      // Si tanto fecha_inicio como fecha_fin están definidas, comprobar si fecha_inicio es posterior a fecha_fin.
      if (fecha_inicio && fecha_fin) {
        console.log('fecha fin: ', fecha_fin);
        
        if (fecha_inicio > fecha_fin) {
          return { 'startMoreThanEnd': { value: fecha_inicio } };
        }
      }
    }
    return null;
  };
}
