import { ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

export interface NgSelectMultipleComponent {
    formGroup: FormGroup;
    formControlName: string;
    items: any[];
    type: NgSelectMultiType;
    disabled: boolean;
    resultType: ResultType;
}

export type NgSelectMultiType = 'departments' | 'positions' | 'users' | 'positionLevels'
export type ResultType = 'obj' | 'id';

@Component({
    selector: 'ngselect-multi',
    templateUrl: './ngselect-multiple.component.html',
    styleUrls: ['./ngselect-multiple.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => NgSelectMultipleComponent),
            multi: true
        },
    ],
})
export class NgSelectMultipleComponent implements ControlValueAccessor, NgSelectMultipleComponent {

    @Input() formGroup: FormGroup;
    @Input() items: any[] = [];
    @Input() formControlName: string;
    @Input() type: NgSelectMultiType = 'departments';
    @Input() disabled: boolean = false;
    @Input() field: string;
    @Input() resultType: ResultType = 'id';

    _items: any[] = [];
    constructor(
        private ref: ChangeDetectorRef,
        private modalService: NgbModal,
    ) {
    }

    ngAfterViewInit(): void {
        this.formGroup?.get(this.formControlName)?.valueChanges.subscribe(res => {
            if (this.resultType === 'obj') {
                this._items = this.items.filter(item => res.map(r => r.id).includes(item.id));
            } else {
                this._items = this.items.filter(item => res.includes(item.id));

            }
        })
    }

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

    removeById(selectItem: any, formControlName: string) {
        let arrTimer = this.formGroup.value[formControlName].filter(id => id != selectItem.id)
        this.formGroup.patchValue({
            [formControlName]: arrTimer
        })
        this.ref.detectChanges();
    }
}

export interface DateTimeChangeEvent {
    index: number;
    startDate: string;
    endDate: string;
}