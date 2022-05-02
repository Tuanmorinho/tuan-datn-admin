import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OffcanvasService {
 private _closeValue$: Subject<any> = new Subject;

  constructor() {
  }

  get closeValue$() {
    return this._closeValue$.asObservable();
  }

  set closeValue(value: any) {
    this._closeValue$.next(value);
    this.dismiss();
  }

  dismiss(){
    let closeBtn = document.getElementById('kt_quick_custom_toggle');
    if(closeBtn){
        closeBtn.click();
    }
  }

}
