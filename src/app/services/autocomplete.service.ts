import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, OnDestroy } from "@angular/core";
import { TermsModel } from "@app/modules/core/model/terms.model";
import { liveSearch } from "@app/modules/core/utils/helpers";
import { Repository } from "@app/repositories/repository";
import { Subject, Observable } from "rxjs";
import { AppHttpClient } from "./app-http.client.service";

@Injectable({
    providedIn: 'root'
})
export class AutoCompleteService extends Repository {
    API_URL: string = '';
    private _terms$ = new Subject<TermsModel>();

    constructor(@Inject(AppHttpClient) httpClient, http: HttpClient) {
        super(httpClient,http)
    }

    readonly assets$ = this._terms$.pipe(liveSearch(obj => this.search(obj.terms, obj.currentPage)))

    searchTerms(terms: TermsModel) {
        this._terms$.next(terms);
    }

    search(keyword: string, currentPage: number): Observable<any> {
        return this.httpClient.post(`${this.API_URL}/search`, {
            keyword,
            currentPage: currentPage || 1,
            displayItems: 12
        });
    }
}