import { Pipe, PipeTransform } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

@Pipe({
    name: 'controlInFormArr'
})
export class ControlInFormArrPipe implements PipeTransform {

    /**
     * 
     * @param get formControl in FormArray 
     */
    transform(controlName: string, formGroup: FormGroup, formArrayName: string, index: number): unknown {
        return ((formGroup.controls[formArrayName] as FormArray).controls[index] as FormGroup).controls[controlName]
    }
}
