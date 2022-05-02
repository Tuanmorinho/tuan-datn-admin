import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function uploadFilesValidator(maxLength, types, maxSize, required): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        if (!value) {
            return null;
        }
        if (maxLength) {
            return { filesLimited: true }
        }
        if (types) {
            return { wrongType: true }

        }
        if (maxSize) {
            return { oversize: true }
        }
        if (required) {
            return null
        }

        return null;
    }
}