import { Injectable } from "@angular/core";
import { CarfModel } from "@app/modules/carf/_models/carf.model";
import { Repository } from "@app/repositories/repository";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class CarfRepository extends Repository {
    API_URL= '/carf'

    search(info: any) : Observable<CarfModel[]> {
        return this.httpClient.post(`${this.API_URL}/search`, info);
    }
}