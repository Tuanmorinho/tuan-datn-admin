import { formatDate } from "@angular/common";
import { Inject, Injectable, OnDestroy } from "@angular/core";
import { UsersModel } from "@app/modules/users/_models/users.model";
import { ITableState, TableResponseModel, TableService } from "@app/_metronic/shared/crud-table";
import { environment } from "environments/environment";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AppHttpClient } from "./app-http.client.service";

@Injectable({
    providedIn: 'root'
})
export class UsersHistoryService extends TableService<any> implements OnDestroy {
    API_URL = `${environment.apiDevUrl}/auth/admin/realms/${environment.KEYCLOAK_REALM}`;

    constructor(@Inject(AppHttpClient) http) {
        super(http);
    }
    ngOnDestroy(): void {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }

    //get list user
    find(tableState: ITableState): Observable<TableResponseModel<UsersModel>> {
        const data: any = this.nomarlizedTableState(tableState);
        const newPaginate = {
            first: data.currentPage,
            max: data.displayItems
        }
        return this.http.get(`${this.API_URL}/users/${data.userId}/sessions`, newPaginate).pipe(
            map((response: any) => {
                const result: TableResponseModel<UsersModel> = {
                    items: response.map(x => {
                        x.start = formatDate(x.start, "dd/MM/yyyy HH:mm", "vi_VI");
                        x.lastAccess = formatDate(x.lastAccess, "dd/MM/yyyy HH:mm", "vi_VI");
                        return x;
                    }),
                    total: response?.length
                };
                return result;
            }),
        );
    }

}
