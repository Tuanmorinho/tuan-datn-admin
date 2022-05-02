import { formatDate } from '@angular/common';
import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef, HostListener } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-validation-error',
    templateUrl: './validation-error.component.html',
    styleUrls: ['./validation-error.component.css'],
    // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValidationErrorComponent implements OnInit {
    @Input() control: FormControl;
    @Input()
    get submitted() {
        return this._submitted;
    }
    set submitted(val) {
        this._submitted = val;
    }
    @Input() field: string;
    private timeout: any;
    private _submitted: boolean;
    static onScrolling: boolean = false;
    constructor(
        private translateService: TranslateService,
        private ref: ChangeDetectorRef) {
    }

    ngOnInit() {
    }

    ngOnChanges(changes: any): void {
        // if (!changes.control?.previousValue && changes.control?.firstChange) {
        //     this.ref.detach();
        // } else {
        //     this.ref.reattach();
        // }
    }

    getMessage() {
        let message = '';
        if (this.control.errors && this._submitted) {
            const fieldName = this.translateService.instant(this.field);
            if (this.control.errors.required) {
                if (this.field !== undefined && this.field !== '') {
                    const fieldName = this.translateService.instant(this.field);
                    message = `${fieldName} là trường bắt buộc`;
                } else {
                    message = `Là trường bắt buộc`;
                }

            }
            if (this.control.errors.email) {
                message = `Email không hợp lệ`;
            }
            if (this.control.errors.min) {
                message = `${fieldName} có giá trị nhỏ nhất là ${this.control.errors.min.min}`;
            }
            if (this.control.errors.max) {
                message = `${fieldName} có giá trị lớn nhất là ${this.control.errors.max.max}`;
            }
            if (this.control.errors.minlength) {
                message = `${fieldName} có độ dài nhỏ nhất là ${this.control.errors.minlength.requiredLength}`;
            }
            if (this.control.errors.maxlength) {
                message = `${fieldName} có độ dài lớn nhất là ${this.control.errors.maxlength.requiredLength}`;
            }
            if (this.control.errors.whitespace) {
                message = 'Oops! That date hasn’t happened yet.';
            }
            if (this.control.errors.birthday) {
                message = 'Oops! That date hasn’t happened yet.';
            }
            if (this.control.errors.duplicated) {
                message = `${fieldName} này đã bị trùng`;
            }
            if (this.control.errors.pattern) {
                if (this.field !== undefined && this.field !== '') {
                    const fieldName = this.translateService.instant(this.field);
                    message = `${fieldName} không hợp lệ`;
                } else {
                    message = `không hợp lệ`;
                }
            }
            if (this.control.errors.NoPassswordMatch) {
                message = 'Mật khẩu không khớp';
            }
            if (this.control.errors.incorrectDate) {
                message = 'Ngày bắt đầu không được lớn hơn ngày kết thúc';
            }
            if (this.control.errors.incorrectMonth) {
                message = 'Tháng bắt đầu không được lớn hơn tháng kết thúc';
            }
            if (this.control.errors.incorrectHour) {
                message = 'Thời gian bắt đầu không được lớn hơn thời gian kết thúc';
            }
            if (this.control.errors.nullDate) {
                message = 'Tháng bắt đầu và tháng kết thúc không được rỗng';
            }
            if (this.control.errors.incorrectQuarter) {
                message = 'Quý bắt đầu không được lớn hơn quý kết thúc';
            }
            if (this.control.errors.owlDateTimeMin) {
                message = `Thời gian ${fieldName} không được nhỏ hơn `+ formatDate(this.control.errors.owlDateTimeMin.min,'dd/MM/YYYY HH:mm','vi_VI');
            }
            if (this.control.errors.owlDateTimeMax) {
                message = `Thời gian ${fieldName} không được lớn hơn `+ formatDate(this.control.errors.owlDateTimeMax.max,'dd/MM/YYYY HH:mm','vi_VI');
            }
        }
        return message;
    }


}
