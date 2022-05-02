import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TextEditorService {
    constructor() { }

    private _touched$:  Subject<any> = new Subject<any>();

    get touched$() {
        return this._touched$.asObservable();
    }

    public touched(){
        this._touched$.next();
    }
}