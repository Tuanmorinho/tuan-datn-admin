import { Inject, Injectable, OnDestroy } from "@angular/core";
import { ACCModel } from "@app/modules/acc/_models/acc.model";
import { ACCRepository } from "@app/repositories/acc/acc.repository";
import { ITableState, TableResponseModel, TableService } from "@app/_metronic/shared/crud-table";
import { Observable, Subject } from "rxjs";
import { finalize, map } from "rxjs/operators";
import { AppHttpClient } from "../app-http.client.service";

@Injectable({
    providedIn: 'root'
})
export class ACCService extends TableService<ACCModel> implements OnDestroy {
    API_URL = '/acc';

    private _dataDetail$ = new Subject<any>();
    private _isCheckSubmitDetail$ = new Subject<any>();
    private _isSubmitDetail$ = new Subject<any>();
    constructor(private repository: ACCRepository, @Inject(AppHttpClient) http) {
        super(http);
    }

    find(tableState: ITableState): Observable<TableResponseModel<ACCModel>> {
        return this.repository.find(this.nomarlizedTableState(tableState)).pipe(
            map((response: any) => {
                const result: TableResponseModel<ACCModel> = {
                    items: response.data.accSearch.records,
                    total: response.data.accSearch.pagination.totalRecords
                };
                return result;
            }),
        );
    }

    actualresult(data) {
        this.isLoading = true;
        return this.http.post(this.API_URL + '/actualresult', data).pipe(
            finalize(() => this.isLoading = false)
        );
    }

    cancelRequest(data) {
        this.isLoading = true;
        return this.http.put(this.API_URL + '/cancel', data).pipe(
            finalize(() => this.isLoading = false)
        );
    }

    reopenRequest(data) {
        this.isLoading = true;
        return this.http.put(this.API_URL + '/reopen', data).pipe(
            finalize(() => this.isLoading = false)
        );
    }

    isCheckSubmitDetail(status) {
        this._isCheckSubmitDetail$.next(status);
    }

    checkSubmitDetail() {
        return this._isCheckSubmitDetail$.asObservable();
    }

    get detailData$() {
        return this._dataDetail$.asObservable();
    }

    onSubmitDetail(data) {
        this._dataDetail$.next(data);
    }

    isSubmitDetail(status) {
        this._isSubmitDetail$.next(status);
    }

    submitDetail() {
        return this._isSubmitDetail$.asObservable();
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }
}