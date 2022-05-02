import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Repository } from './repository';

@Injectable({
    providedIn: 'root'
})
export class CustomerRepository extends Repository {
    API_URL = `/warehouse/customers`;

    search(info: any): Observable<any[]> {
        return this.httpClient.get(this.API_URL, info);
    }

}