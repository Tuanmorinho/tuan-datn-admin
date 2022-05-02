import { ChangeDetectorRef, Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ActivatedRoute, Params } from '@angular/router';
import { HeaderConfig } from '@app/modules/core/table/setting-header-table/_models/header.config';
import { ComponentService } from '@services/component.service';
import { DateTimeAdapter, OWL_DATE_TIME_LOCALE, OWL_DATE_TIME_LOCALE_PROVIDER } from 'ng-pick-datetime';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs'
import { ChipItemModel } from '../reusable-components/components/permission-field/ChipItemModel';
import { download, Download } from '../utils/download';
import { decryptUsingAES256 } from '../utils/helpers';
import { toISOLocal } from '@app/modules/core/utils/helpers';

class CustomDateAdapter extends MomentDateAdapter {
    getMonthNames(style: 'long' | 'short' | 'narrow') {
        return ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
    }
}


class CustomDateTimeAdapter extends DateTimeAdapter<Date> {

    locale = 'vi-VI';
    /** The default date names to use if Intl API is not available. */
    DEFAULT_DATE_NAMES = this.range(31, i => String(i + 1));

    DEFAULT_MONTH_NAMES = {
        'long': [
            'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9',
            'Tháng 10', 'Tháng 11', 'Tháng 12'
        ],
        'short': ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
        'narrow': ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
    };

    DEFAULT_DAY_OF_WEEK_NAMES = {
        'long': ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'],
        'short': ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
        'narrow': ['S', 'M', 'T', 'W', 'T', 'F', 'S']
    };

    ISO_8601_REGEX = /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|(?:(?:\+|-)\d{2}:\d{2}))?)?$/;

    private SUPPORTS_INTL_API = typeof Intl !== 'undefined';
    getYear(date: Date): number {
        return date.getFullYear();
    }
    getMonth(date: Date): number {
        return date.getMonth();
    }
    getDay(date: Date): number {
        return date.getDay();
    }
    getDate(date: Date): number {
        return date.getDate();
    }
    getHours(date: Date): number {
        return date.getHours();
    }
    getMinutes(date: Date): number {
        return date.getMinutes();
    }
    getSeconds(date: Date): number {
        return date.getSeconds();
    }
    getTime(date: Date): number {
        return date.getTime();
    }
    getNumDaysInMonth(date: Date): number {
        const lastDateOfMonth = this.createDateWithOverflow(this.getYear(date), this.getMonth(date) + 1, 0);
        return this.getDate(lastDateOfMonth);
    }
    getDateNames(): string[] {
        if (this.SUPPORTS_INTL_API) {
            const dtf = new Intl.DateTimeFormat(this.locale, { day: 'numeric', timeZone: 'utc' });
            return this.range(31, i => this._stripDirectionalityCharacters(
                this._format(dtf, new Date(2017, 0, i + 1))));
        }
        return this.DEFAULT_DATE_NAMES;
    }
    private createDateWithOverflow(year: number, month: number, date: number, hours?: number, minutes?: number, seconds?: number): any {
        if (hours === void 0) { hours = 0; }
        if (minutes === void 0) { minutes = 0; }
        if (seconds === void 0) { seconds = 0; }
        const result = new Date(year, month, date, hours, minutes, seconds);
        if (year >= 0 && year < 100) {
            result.setFullYear(this.getYear(result) - 1900);
        }
        return result;
    }
    differenceInCalendarDays(dateLeft: Date, dateRight: Date): number {
        if (this.isValid(dateLeft) && this.isValid(dateRight)) {
            const dateLeftStartOfDay = this.createDate(this.getYear(dateLeft), this.getMonth(dateLeft), this.getDate(dateLeft));
            const dateRightStartOfDay = this.createDate(this.getYear(dateRight), this.getMonth(dateRight), this.getDate(dateRight));
            const timeStampLeft = this.getTime(dateLeftStartOfDay) - dateLeftStartOfDay.getTimezoneOffset() * this.milliseondsInMinute;
            const timeStampRight = this.getTime(dateRightStartOfDay) - dateRightStartOfDay.getTimezoneOffset() * this.milliseondsInMinute;
            return Math.round((timeStampLeft - timeStampRight) / this.millisecondsInDay);
        } else {
            return null;
        }
    }
    getYearName(date: Date): string {
        if (this.SUPPORTS_INTL_API) {
            const dtf = new Intl.DateTimeFormat(this.locale, { year: 'numeric' });
            return this.stripDirectionalityCharacters(dtf.format(date));
        }
        return String(this.getYear(date));
    }
    private stripDirectionalityCharacters(str: string): string {
        return str.replace(/[\u200e\u200f]/g, '');
    }
    getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
        const _this = this;
        if (this.SUPPORTS_INTL_API) {
            const dtf_1 = new Intl.DateTimeFormat(this.locale, { month: style });
            return this.range(12, function (i) {
                return _this.stripDirectionalityCharacters(dtf_1.format(new Date(2017, i, 1)));
            });
        }
        return this.DEFAULT_MONTH_NAMES[style];
    }
    private range(longitud: number, valueFunction: (i: any) => string): string[] {
        const valuesArray = Array(longitud);
        for (let i = 0; i < longitud; i++) {
            valuesArray[i] = valueFunction(i);
        }
        return valuesArray;
    }
    getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
        const _this = this;
        if (this.SUPPORTS_INTL_API) {
            const dtf_2 = new Intl.DateTimeFormat(this.locale, { weekday: style });
            return this.range(7, function (i) {
                return _this.stripDirectionalityCharacters(dtf_2.format(new Date(2017, 0, i + 1)));
            });
        }
        return this.DEFAULT_DAY_OF_WEEK_NAMES[style];
    }
    toIso8601(date: Date): string {
        return date.toISOString();
    }
    isEqual(dateLeft: Date, dateRight: Date): boolean {
        if (this.isValid(dateLeft) && this.isValid(dateRight)) {
            return dateLeft.getTime() === dateRight.getTime();
        } else {
            return false;
        }
    }
    isSameDay(dateLeft: Date, dateRight: Date): boolean {
        if (this.isValid(dateLeft) && this.isValid(dateRight)) {
            const dateLeftStartOfDay = this.clone(dateLeft);
            const dateRightStartOfDay = this.clone(dateRight);
            dateLeftStartOfDay.setHours(0, 0, 0, 0);
            dateRightStartOfDay.setHours(0, 0, 0, 0);
            return dateLeftStartOfDay.getTime() === dateRightStartOfDay.getTime();
        } else {
            return false;
        }
    }
    isValid(date: Date): boolean {
        return date && !isNaN(date.getTime());
    }
    invalid(): Date {
        return new Date(NaN);
    }
    isDateInstance(obj: any): boolean {
        return obj instanceof Date;
    }
    addCalendarYears(date: Date, amount: number): Date {
        return this.addCalendarMonths(date, amount * 12);
    }
    addCalendarMonths(date: Date, amount: number): Date {
        const result = this.clone(date);
        amount = Number(amount);
        const desiredMonth = result.getMonth() + amount;
        const dateWithDesiredMonth = new Date(0);
        dateWithDesiredMonth.setFullYear(result.getFullYear(), desiredMonth, 1);
        dateWithDesiredMonth.setHours(0, 0, 0, 0);
        const daysInMonth = this.getNumDaysInMonth(dateWithDesiredMonth);
        result.setMonth(desiredMonth, Math.min(daysInMonth, result.getDate()));
        return result;
    }
    addCalendarDays(date: Date, amount: number): Date {
        const result = this.clone(date);
        amount = Number(amount);
        result.setDate(result.getDate() + amount);
        return result;
    }
    setHours(date: Date, amount: number): Date {
        const result = this.clone(date);
        result.setHours(amount);
        return result;
    }
    setMinutes(date: Date, amount: number): Date {
        const result = this.clone(date);
        result.setMinutes(amount);
        return result;
    }
    setSeconds(date: Date, amount: number): Date {
        const result = this.clone(date);
        result.setSeconds(amount);
        return result;
    }
    createDate(year: number, month: number, date: number): Date;
    createDate(year: number, month: number, date: number, hours: number, minutes: number, seconds: number): Date;
    createDate(year: any, month: any, date: any, hours?: any, minutes?: any, seconds?: any) {
        if (hours === void 0) { hours = 0; }
        if (minutes === void 0) { minutes = 0; }
        if (seconds === void 0) { seconds = 0; }
        if (month < 0 || month > 11) {
            throw Error('Invalid month index \"' + month + '\". Month index has to be between 0 and 11.');
        }
        if (date < 1) {
            throw Error('Invalid date \"' + date + '\". Date has to be greater than 0.');
        }
        if (hours < 0 || hours > 23) {
            throw Error('Invalid hours \"' + hours + '\". Hours has to be between 0 and 23.');
        }
        if (minutes < 0 || minutes > 59) {
            throw Error('Invalid minutes \"' + minutes + '\". Minutes has to between 0 and 59.');
        }
        if (seconds < 0 || seconds > 59) {
            throw Error('Invalid seconds \"' + seconds + '\". Seconds has to be between 0 and 59.');
        }
        const result = this.createDateWithOverflow(year, month, date, hours, minutes, seconds);
        if (result.getMonth() !== month) {
            throw Error('Invalid date \"' + date + '\" for month with index \"' + month + '\".');
        }
        return result;
    }
    clone(date: Date): Date {
        return new Date(date.getTime());
    }
    now(): Date {
        return new Date();
    }
    format(date: Date, displayFormat: any): string {
        if (!this.isValid(date)) {
            throw Error('JSNativeDate: Cannot format invalid date.');
        }
        const dateWithoutTime = ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' +
            date.getFullYear() + ' ' + date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0');

        return dateWithoutTime;
    }
    parse(value: any, parseFormat: any): Date {
        if (typeof value === 'number') {
            return new Date(value);
        }
        return value ? new Date(Date.parse(value)) : null;
    }

    deserialize(value) {
        if (typeof value === 'string') {
            if (!value) {
                return null;
            }
            if (this.ISO_8601_REGEX.test(value)) {
                const date = new Date(value);
                if (this.isValid(date)) {
                    return date;
                }
            }
        }
        return super.deserialize.call(this, value);
    }



    /**
     * Strip out unicode LTR and RTL characters. Edge and IE insert these into formatted dates while
     * other browsers do not. We remove them to make output consistent and because they interfere with
     * date parsing.
     * @param str The string to strip direction characters from.
     * @returns The stripped string.
     */
    private _stripDirectionalityCharacters(str: string) {
        return str.replace(/[\u200e\u200f]/g, '');
    }

    /**
     * When converting Date object to string, javascript built-in functions may return wrong
     * results because it applies its internal DST rules. The DST rules around the world change
     * very frequently, and the current valid rule is not always valid in previous years though.
     * We work around this problem building a new Date object which has its internal UTC
     * representation with the local date and time.
     * @param dtf Intl.DateTimeFormat object, containg the desired string format. It must have
     *    timeZone set to 'utc' to work fine.
     * @param date Date from which we want to get the string representation according to dtf
     * @returns A Date object with its UTC representation based on the passed in date info
     */
    private _format(dtf: Intl.DateTimeFormat, date: Date) {
        const d = new Date(Date.UTC(
            date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(),
            date.getMinutes(), date.getSeconds(), date.getMilliseconds()));
        return dtf.format(d);
    }
}

export const baseComponentProviders = [
    {
        provide: MAT_DATE_FORMATS,
        useValue: {
            parse: {
                dateInput: ['l', 'LL'],
            },
            display: {
                dateInput: 'L',
                monthYearLabel: 'MMMM YYYY',
                dateA11yLabel: 'LL',
                monthYearA11yLabel: 'MMMM YYYY',
            },
        },
    },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    { provide: MAT_DATE_LOCALE, useValue: 'vi-VI' },
    { provide: OWL_DATE_TIME_LOCALE, useValue: 'vi' },
    { provide: OWL_DATE_TIME_LOCALE_PROVIDER, useValue: { useUtc: true } },
    { provide: DateTimeAdapter, useClass: CustomDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE, OWL_DATE_TIME_LOCALE_PROVIDER] },
    { provide: DateAdapter, useClass: CustomDateAdapter, deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS] },
]

import { saveAs } from 'file-saver';
import { ResponseModel } from '../model/response-model';
import { RoleOfUser } from '../interfaces/interfaces';
@Component({
    selector: 'app-base',
    templateUrl: './base.component.html',
    styleUrls: ['./base.component.css'],
})
export class BaseComponent implements OnInit, OnDestroy {
    @Input() isModal: boolean = false;
    @Input() ids: number[];
    @Input() filter: any;
    @Input() isSelectedOnlyItem: boolean = false;
    @Input() hasScrollbarX: boolean = true;

    actionType = {
        save: 1,
        submit: 2
    }

    isShowDetailRequest: boolean = true;
    todayDate: Date = new Date();
    reviewProcesses = [];
    headersConfig: HeaderConfig[] = [];
    public subscription = new Subscription();

    //Override
    formGroup: FormGroup;
    listUsers = [];
    listPositions = [];
    listDepartments = [];
    listPositionLevels = [];
    locations: any[];

    isHideUsers: boolean = false;
    isHidePositions: boolean = false;
    isHideDepartments: boolean = false;
    isHidePostionLevels: boolean = false;

    ref: ChangeDetectorRef;

    _downloadDocument$: Observable<Download>;

    constructor(protected service: ComponentService) { }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    protected get router() {
        return this.service.router;
    }

    public get activatedRoute(): ActivatedRoute {
        let route = this.router.routerState.root;
        while (route.firstChild) {
            route = route.firstChild;
        }
        return route;
    }

    protected get queryParams() {
        return this.activatedRoute.queryParams;
    }

    protected get routeParams(): Params {
        return this.activatedRoute.snapshot.params;
    }

    protected get dialogService() {
        return null;
    }

    public get roleOfUser(): RoleOfUser {
        const user = this.service.authService.currentUserValue;
        return decryptUsingAES256(user.userRole);
    }

    checkPermissionDownload(name: string, url: string) {
        const user = this.service.authService.currentUserValue;
        const userRole: RoleOfUser = decryptUsingAES256(user.userRole);
        if (userRole?.isDownload) {
            this._downloadDocument$ = this.download(url, name);
        } else {
            this.service.alertFlashService.warn(['Bạn không có quyền download tài liệu này']);
        }
    }

    download(url: string, filename?: string): Observable<Download> {
        return this.service.httpClient.get(url, {
            reportProgress: true,
            observe: 'events',
            responseType: 'blob'
        }).pipe(download(blob => saveAs(blob, filename)))
    }

    checkExtAllow(name: any) {
        if (name) {
            const extFile = name.split('.').pop();
            if (extFile === 'doc' || extFile === 'docx' || extFile === 'xls' || extFile === 'xlsx' || extFile === 'pdf' || extFile === 'ppt' || extFile === 'pptx') {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    optionsAlert = {
        autoClose: true,
        keepAfterRouteChange: true
    };

    optionsAlert2 = {
        autoClose: true,
        keepAfterRouteChange: false
    };

    ngOnInit(): void {
    }

    filterUserRole() {
        const user = this.service.authService.currentUserValue;
        const userRole = user?.userRole ? decryptUsingAES256(user.userRole) : null;

        if (!userRole) {
            return;
        }
        const roleRouter = Object.keys(this.activatedRoute.snapshot.data) || [];
        const checkHasPermission = roleRouter.filter(v => {
            return userRole[v]
        }).length;
        if (user?.userRole && !checkHasPermission && roleRouter.length) {
            alert('Bạn không có quyền vào trang này');
            this.service.location.back();
        }
    }

    clearValidator(formGroupName) {
        this.formGroup.get(formGroupName).clearValidators();
        this.formGroup.get(formGroupName).updateValueAndValidity();
    }

    public handleError(error: any) {
        let message = [];
        if (error.error.status == 400) {
            const errors = error.error.errors;
            if (errors !== null && errors !== undefined) {
                Object.keys(errors).forEach((key) => {
                    for (let i = 0; i < errors[key].length; i++) {
                        message.push(errors[key][i]);
                    }
                });
            }
            if (message.length === 0) {
                message.push('Có lỗi xảy ra');
            }
        } else if (error.error.status == 500) {
            message.push('Có lỗi xảy ra');
        } else {
            message.push(error.error.detail);
        }
        if (error.isArray) {
            return error.join('<br>');
        } else {
            return message.join('<br>');
        }
    }

    showError(error: any, ref: ChangeDetectorRef) {
        this.service.alertFlashService.clear();
        this.service.alertFlashService.error(error, this.optionsAlert2);
        ref.markForCheck();
    }

    protected redirect(path: any, queryParams?: any, replaceUrl = false) {
        const commands = path instanceof Array ? path : [path];
        this.router.navigate(commands, { queryParams, replaceUrl });
    }

    isControlValid(controlName: string): boolean {
        const control = this.formGroup.controls[controlName];
        return control.valid && (control.dirty || control.touched);
    }

    isControlInvalid(controlName: string): boolean {
        const control = this.formGroup.controls[controlName];
        return control.invalid && (control.dirty || control.touched);
    }

    removeChipItem(event: ChipItemModel) {
        let propValue = this.formGroup.get(event.formControlName).value;
        if (propValue[event.key] && propValue[event.key].length > 0) {
            propValue[event.key] = propValue[event.key].filter(item => item.id != event.selectedItem.id)
            let length = propValue.departments?.length + propValue.positionLevels?.length + propValue.positions?.length + propValue.users?.length;
            if (length === 0 || isNaN(length)) propValue = null;
            this.formGroup.patchValue({
                [event.formControlName]: propValue
            });
            this.ref.detectChanges();
        }
    }

    scrollToFirstInvalid() {
        setTimeout(() => {
            let classElement: any = document.getElementsByClassName('invalid-error');
            if (classElement.length > 0) {
                classElement = Array.from(classElement).filter((e: any) => e.innerText !== '');
                classElement[0]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100)
    }

    isShowed(id): boolean {
        let isShowed: boolean = false;
        headersLoop: for (let header of this.headersConfig) {
            if (Number(header.id) === id) {
                isShowed = header.isShowed
                break headersLoop;
            }
            if (header.subheaders?.length > 0) {
                for (let subheader of header.subheaders) {
                    if (Number(subheader.id) === id) {
                        isShowed = subheader.isShowed;
                        break headersLoop;
                    }
                }
            }
        }
        return isShowed;
    }
}
