import { formatDate } from "@angular/common";
import * as moment from "moment";
import { Observable } from "rxjs";
import { debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";

import * as CryptoJS from 'crypto-js';

const tokenFromUI: string = "0123456789123456";

export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function lowerFirstLetter(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}

export function cleanObject(obj) {
    for (var propName in obj) {
        if (obj[propName] === null || obj[propName] === undefined || obj[propName] === '') {
            delete obj[propName];
        }
    }
    return obj
}

export function sort_by(field: string, reverse, primer) {
    const key: any = primer ?
        function (x) {
            return primer(x[field])
        } :
        function (x) {
            return x[field]
        };

    reverse = !reverse ? 1 : -1;

    return function (a: any, b: any) {
        return a = key(a), b = key(b), reverse * (Number(a > b) - Number(b > a));
    }
}


export function arrayUnique(arr: any[], key: string, targetArr: any[]): any[] {
    let uniqArr: Object = {};

    for (let i = 0; i < arr.length; i++) {
        if (uniqArr.hasOwnProperty(arr[i][key])) {
            uniqArr[arr[i][key]] = Number(uniqArr[arr[i][key]]) + 1;
        } else {
            uniqArr[arr[i][key]] = 1;
        }
    }

    return distinctArr(arr.filter(arr => (uniqArr.hasOwnProperty(arr[key]) && uniqArr[arr[key]] === 1)).concat(targetArr), key)
}

export function getListRefFiles(formValue, key): any[] {
    let arr: any[] = [];
    if (formValue.documents.length > 0) {
        arr = arr.concat(formValue.documents.map(document => document[key]));
    }
    if (formValue.templates.length > 0) {
        arr = arr.concat(formValue.templates.map(template => template[key]));
    }
    if (formValue.externalDocuments.length > 0) {
        arr = arr.concat(formValue.externalDocuments.map(extDocument => extDocument['fileMains']).flat());
    }
    return arr;
}

export function distinctArr(arr, key) {
    return [...new Map(arr.map(item =>
        [item[key], item])).values()];
}

export function normalizePermission(data) {
    if (data.departments?.length > 0) {
        data.departmentIds = data.departments.map(d => d.id);
    } else {
        data.departmentIds = [];
    }

    if (data.positionLevels?.length > 0) data.positionLevelIds = data.positionLevels.map(d => d.id);
    else data.positionLevelIds = [];

    if (data.positions?.length > 0) data.positionIds = data.positions.map(d => d.id);
    else data.positionIds = [];

    if (data.users?.length > 0) {
        data.userIds = data.users.map(d => d.id && d.id);
    } else {
        data.userIds = [];
    }

    delete data.departments;
    delete data.positions;
    delete data.positionLevels;
    delete data.users;

    return data;
}

export function liveSearch<T, R>(
    predict: (query: T) => Observable<R>,
    delay = 500
) {
    return (source$: Observable<T>) => source$.pipe(
        debounceTime(delay),
        distinctUntilChanged(),
        switchMap(predict)
    )
}

export function nomarlizedocumentRelated(data) {
    switch (data.documentKindFlag) {
        case 1:
            delete data.templateId;
            delete data.externalDocumentId;
            break;
        case 2:
            delete data.externalDocumentId;
            delete data.documentId;
            break;
        case 3:
            delete data.documentId;
            delete data.templateId;
            break;
    }

    if (data.documentKindFlag != 1) delete data.documentId;
    if (data.relateDocs) {
        data.documentIds = data.relateDocs.documents.length > 0 ? data.relateDocs.documents.map(doc => doc.id) : [];
        data.templateIds = data.relateDocs.templates.length > 0 ? data.relateDocs.templates.map(temp => temp.id) : [];
        data.externalDocumentIds = data.relateDocs.externalDocuments.length > 0 ? data.relateDocs.externalDocuments.map(doc => doc.id) : [];
        data.requestDocumentIds = data.relateDocs.requestDocuments.length > 0 ? data.relateDocs.requestDocuments.map(doc => doc.id) : [];
        delete data.relateDocs;
    }
    return data;
}

export function getLastItem(items) {
    if (items?.length) return null;
    return items[items.length - 1];
}

export function convertToHHMM(time) {
    if (!time) return null;

    if (time instanceof Date) return (time.toLocaleTimeString('vi-Vi')).substring(0, 5)
    else return time.split('T')[1].substring(0, 5)
}

export function toISOLocal(d) {
    var z = n => ('0' + n).slice(-2);
    var zz = n => ('00' + n).slice(-3);
    var off = d.getTimezoneOffset();
    off = Math.abs(off);

    return d.getFullYear() + '-'
        + z(d.getMonth() + 1) + '-' +
        z(d.getDate()) + 'T' +
        z(d.getHours()) + ':' +
        z(d.getMinutes()) + ':' +
        z(d.getSeconds()) + '.' +
        zz(d.getMilliseconds());
}

export function getDatesBetween(startDate, endDate, includeEndDate?: boolean): any {
    let dates = [];
    let currentDate = new Date(startDate);
    let eDate = new Date(endDate);
    while (currentDate.getDate() < eDate.getDate()) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }
    if (includeEndDate) dates.push(eDate);
    return dates;
};

export function diffMinutes(date1: Date, date2: Date): number {
    let diff = (date2.getTime() - date1.getTime()) / 1000;
    diff /= 60;

    return diff > 0 ? Math.floor(diff) : Math.ceil(diff)

}

export function arrayPartition(array: any[], predicate: (item: any) => boolean): [any[], any[]] {
    return array.reduce((pair, item) => {
        const condition = predicate(item);
        if (item != undefined) (condition ? pair[0] : pair[1]).push(item)
        return pair;
    }, [[], []]);
}

export function compareDates(date1, date2): boolean {
    date1 = formatDate(date1, 'yyyy-MM-dd HH:mm', 'vi_VI')
    date2 = formatDate(date2, 'yyyy-MM-dd HH:mm', 'vi_VI')
    if (date1 > date2) return true
    else return false
}

export function compareDatesByDay(date1, date2): number {
    date1 = formatDate(date1, 'yyyy-MM-dd', 'vi_VI')
    date2 = formatDate(date2, 'yyyy-MM-dd', 'vi_VI')
    if (date1 > date2) return 1;
    if (date1 < date2) return -1;
    else return 0;
}

export function addDays(date, years) {
    let result = moment(date)
    result.add(years, 'years');
    return result.format('DD/MM/YYYY');
}

export function encryptUsingAES256(request: string) {
    let _key = CryptoJS.enc.Utf8.parse(tokenFromUI);
    let _iv = CryptoJS.enc.Utf8.parse(tokenFromUI);
    let encrypted = CryptoJS.AES.encrypt(
        JSON.stringify(request), _key, {
        keySize: 16,
        iv: _iv,
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
}
export function decryptUsingAES256(encrypted: string) {
    let _key = CryptoJS.enc.Utf8.parse(tokenFromUI);
    let _iv = CryptoJS.enc.Utf8.parse(tokenFromUI);

    return JSON.parse(CryptoJS.AES.decrypt(
        encrypted, _key, {
        keySize: 16,
        iv: _iv,
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    }).toString(CryptoJS.enc.Utf8));
}
