import { Inject, Injectable, OnDestroy } from "@angular/core";
import { POModel } from "@app/modules/warehouse/po/model/po.model";
import {
  ITableState,
  TableResponseModel,
  TableService,
} from "@app/_metronic/shared/crud-table";
import { BehaviorSubject, Observable } from "rxjs";
import { finalize, map } from "rxjs/operators";
import { AppHttpClient } from "./app-http.client.service";

@Injectable({
  providedIn: "root",
})
export class POService extends TableService<POModel> {
  API_URL = "/warehouse/purchase-order";

  constructor(@Inject(AppHttpClient) http) {
    super(http);
  }

  find(
    tableState: ITableState
  ): Observable<TableResponseModel<POModel>> {
    const data = this.nomarlizedTableState(tableState);
    return this.http.get(this.API_URL, data).pipe(
      map((response: any) => {
        const result: TableResponseModel<any> = {
          items: response.data,
          total: response?.meta.itemCount,
        };
        return result;
      })
    );
  }

  updatePO(data: POModel) {
    this.isLoading = true;
    return this.http.put(`${this.API_URL}`, data).pipe(
        finalize(() => this.isLoading = false)
    )
  }

  getDetailPO(data) {
    this.isLoading = true;
    return this.http.get(`${this.API_URL}/detail`, data).pipe(
        finalize(() => this.isLoading = false)
    )
  }

  cancelPO(data) {
    this.isLoading = true;
    return this.http.post(`${this.API_URL}/cancel`, data).pipe(
        finalize(() => this.isLoading = false)
    )
  }

  removePODetail(data) {
    this.isLoading = true;
    return this.http.delete(`${this.API_URL}/detail`, data).pipe(
        finalize(() => this.isLoading = false)
    )
  }
}
