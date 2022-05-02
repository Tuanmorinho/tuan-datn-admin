import { ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'owl-datetime-f-array',
    templateUrl: './owl-datetime.component.html',
    styleUrls: ['./owl-datetime.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => OwlDatetimeFormArrayComponent),
            multi: true
        }
    ],
})
export class OwlDatetimeFormArrayComponent implements ControlValueAccessor {

    // @Input() formArrayName: string;
    @Input() formGroup: FormGroup;
    @Input() index: number;
    @Input() formControlName: string;
    @Input() set dateType(value: string) {
        this._dateType = value;
        if (value === 'HH:mm' || value === 'HH:mm:ss') {
            this.pickerType = 'timer';
        } else {
            this.pickerType = 'calendar'
        }
    };
    @Input() disabled: boolean = false;
    @Input() errorField: string;
    @Input() startDate: string = 'estimatedTimeIn';
    @Input() endDate: string = 'estimatedTimeOut';
    @Output() datetimeChange = new EventEmitter();

    _dateType: string = 'dd/MM/yyyy HH:mm';
    pickerType: string = 'calendar';
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

    dateValidator(index, startDate, endDate) {
        let datetimeChangeEvent: DateTimeChangeEvent = { index, startDate, endDate }
        this.datetimeChange.emit(datetimeChangeEvent)
    }

    isControlInValid(controlName: string) {
        const control = this.formGroup.controls[controlName];
        return control.invalid && (control.dirty || control.touched);
    }
}

export interface DateTimeChangeEvent {
    index: number;
    startDate: string;
    endDate: string;
}