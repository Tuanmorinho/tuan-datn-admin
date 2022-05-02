import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class DynamicService {
   private submitFormEvent = new Subject();

    submitFrom$ = this.submitFormEvent.asObservable();

    submitForm(): void{
        this.submitFormEvent.next();
    }

}