import { AppHttpClient } from './app-http.client.service';
import { Inject, Injectable } from '@angular/core';
import { ITableState, TableResponseModel, TableService } from '@app/_metronic/shared/crud-table';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class InventoryService extends TableService<any> {
    API_URL = '/warehouse/inventory/items';

    constructor(
        @Inject(AppHttpClient) http
    ) {
        super(http);
    }

    find(tableState: ITableState): Observable<TableResponseModel<any>> {
        const data = this.nomarlizedTableState(tableState);
        return this.http.get(this.API_URL, data).pipe(
            map((response: any) => {
                const result: TableResponseModel<any> = {
                    items: response.data,
                    total: response?.meta.itemCount,
                };
                return result;
            }),
        );
    }
}