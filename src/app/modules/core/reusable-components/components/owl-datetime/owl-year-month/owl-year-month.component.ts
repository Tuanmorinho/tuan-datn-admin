import { ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'owl-year-month',
    templateUrl: './owl-year-month.component.html',
    styleUrls: ['./owl-year-month.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => OwlYearMonthComponent),
            multi: true
        },
    ],
})
export class OwlYearMonthComponent implements ControlValueAccessor {

    // @Input() formArrayName: string;
    @Input() formGroup: FormGroup;
    @Input() index: number;
    @Input() formControlName: string;
    @Input() dateType: string;
    @Input() disabled: boolean = false;
    @Input() errorField: string;
    @Input() isSelectedOnlyItem: boolean = false;
    @Output() datetimeChange = new EventEmitter();

    constructor(
        private ref: ChangeDetectorRef,
    ) { }

    onChange(event) {
    }

    onTouched() { }

    writeValue(files: any): void {
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    isControlInValid(controlName: string) {
        const control = this.formGroup.controls[controlName];
        return control.invalid && (control.dirty || control.touched);
    }

    removeById(selectedTime: any, formControlName: string) {

        let arrTimer = this.formGroup.value[formControlName].filter(item => item != selectedTime)
        this.formGroup.patchValue({
            [formControlName]: arrTimer
        })
        this.ref.detectChanges();
    }

    chosenMonthHandler(value, datepicker) {
        let arrTimer = this.formGroup.value[this.formControlName];
        arrTimer.push(value);

        this.formGroup.patchValue({
            [this.formControlName]: arrTimer
        })
        datepicker.close();
    }
}

export interface DateTimeChangeEvent {
    index: number;
    startDate: string;
    endDate: string;
}