import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Repository } from './repository';

@Injectable({
    providedIn: 'root'
})
export class SkuRepository extends Repository {
    API_URL = `/warehouse/items`;

    search(info: any): Observable<any[]> {
        return this.httpClient.get(this.API_URL, info);
    }

}