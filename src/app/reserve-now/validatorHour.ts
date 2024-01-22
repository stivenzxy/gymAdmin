import { AbstractControl, ValidatorFn } from "@angular/forms";

export function futureHourValidator(): ValidatorFn {
    return (control: AbstractControl) : {[key: string]: any} | null => {
        const currentTime = new Date();

        let hours = String(currentTime.getHours()).padStart(2, '0');
        let minutes = String(currentTime.getMinutes()).padStart(2,'0');

        let currentTimeString = `${hours}:${minutes}`;

        if(!control.value) {
            return null;
        }

        // validar que sean horas con minutos HH:00 || HH:30
        const validMinutesFormat = control.value.endsWith(':00') || control.value.endsWith(':30');
        if (!validMinutesFormat) {
            return {'invalidMinuteFormat' : { value: control.value }};
        }


        const isPastTime = control.value < currentTimeString;

        return isPastTime ? {'pastTime' : {value: control.value}} : null;
    }
}