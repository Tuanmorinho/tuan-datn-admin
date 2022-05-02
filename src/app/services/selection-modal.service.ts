import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SelectionModalService {
    constructor() { }

    private _selectedItems$ = new BehaviorSubject<any>([]);
    private _isCloseModal$ = new Subject<void>();

    get selectedItems$() {
        return this._selectedItems$.asObservable();
    }

    set selectedItems(val: any[]) {
        this._selectedItems$.next(val)
    }

    get isCloseModal$() {
        return this._isCloseModal$.asObservable();
    }

    onCloseModal() {
        this._isCloseModal$.next();
    }
}