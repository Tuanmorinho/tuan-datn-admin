import { Injectable } from '@angular/core';
import { AssetsModel } from '@app/modules/assets/_models/assets.model';
import { Repository } from '@app/repositories/repository';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AssetsRepository extends Repository {
    API_URL = '/assetmanagement'

    find(info: any): Observable<AssetsModel[]> {
        return this.httpClient.post(`${this.API_URL}/search`, info);
    }

    publishDocument(data): Observable<any>{
        return this.httpClient.put(`${this.API_URL}/publish`, data);
    }
}
