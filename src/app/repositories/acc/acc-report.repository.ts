import { Injectable } from "@angular/core";
import { AnnualModel } from "@app/modules/audit-internal/annual/_models/annual.model";
import { Repository } from "@app/repositories/repository";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ACCReportRepository extends Repository {
    API_URL= '/accreport'

    find(info: any) : Observable<AnnualModel[]> {
        return this.httpClient.post(`${this.API_URL}/search`, info);
    }
}