import { Injectable } from "@angular/core";
import { DocumentModel } from "@app/modules/document/_models/document.model";
import { Repository } from "@app/repositories/repository";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DocumentRepository extends Repository {
    API_URL = '/document'

    find(info: any): Observable<DocumentModel[]> {
        return this.httpClient.post(`${this.API_URL}/search`, info);
    }

    publishDocument(data): Observable<any>{
        return this.httpClient.put(`${this.API_URL}/publish`, data);
    }

    searchPublish(data): Observable<any>{
        return this.httpClient.post(`${this.API_URL}/searchpublished`, data);
    }
}
