import { Injectable } from "@angular/core";
import { Repository } from "@app/repositories/repository";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ACCRepository extends Repository {
    API_URL= '/acc'

    find(info: any) : Observable<any[]> {
        return this.httpClient.post(`${this.API_URL}/search`, info);
    }
}