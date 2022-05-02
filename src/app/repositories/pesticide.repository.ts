import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Repository } from '@app/repositories/repository';

@Injectable({
    providedIn: "root"
})
export class PesticideRepository extends Repository {
    API_URL = `/pesticide`;

    search(info: any): Observable<any[]> {
        return this.httpClient.get(this.API_URL, info);
    }
}