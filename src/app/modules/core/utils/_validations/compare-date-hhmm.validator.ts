import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { compareDates } from "@app/modules/core/utils/helpers";

export function compareDateHHmmValidator(date1: string, date2: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const firstDate = control.get(date1).value;
        const secondDate = control.get(date2).value;

        if (!firstDate || !secondDate) return { required: true }
        
        if (compareDates(firstDate, secondDate)) return { incorrectHour: true };
        return null;
    }
}