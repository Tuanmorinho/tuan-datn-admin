import { Inject, Injectable, OnDestroy } from "@angular/core";
import { RoleModel } from "@app/modules/users/_models/role.model";
import { AppHttpClient } from "@app/services/app-http.client.service";
import { TableService } from "@app/_metronic/shared/crud-table";

@Injectable({
    providedIn: 'root'
})
export class RoleService extends TableService<RoleModel> implements OnDestroy {
    API_URL = '/userrole';

    constructor(@Inject(AppHttpClient) http) {
        super(http);
    }

    // find(tableState: ITableState): Observable<TableResponseModel<SectionModel>> {
    //     let transformParams = this.nomarlizedTableState(tableState)
    //     return this.repository.find(transformParams).pipe(
    //         map((response: any) => {
    //           const result: TableResponseModel<SectionModel> = {
    //             items: response.data.sections.records.map(v => {
    //               v.department = v.department.name;
    //               return v;
    //             }),
    //             total: response.data.sections.pagination.totalPages
    //           };
    //           return result;
    //         }),
    //       );
    // }


    ngOnDestroy(): void {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }
}