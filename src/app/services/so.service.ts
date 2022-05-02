import { Inject, Injectable } from "@angular/core";
import { ITEM_GROUP } from "@app/modules/core/utils/constants";
import { SOModel } from "@app/modules/warehouse/SO/models/so.model";
import { SupplierModel } from "@app/modules/warehouse/supplier/models/supplier.model";
import { SORepository } from "@app/repositories/so.repository";
import { SupplierRepository } from "@app/repositories/supplier.repository";
import {
  ITableState,
  TableResponseModel,
  TableService,
} from "@app/_metronic/shared/crud-table";
import { BehaviorSubject, Observable } from "rxjs";
import { finalize, map, switchMap } from "rxjs/operators";
import { AppHttpClient } from "./app-http.client.service";

@Injectable({
  providedIn: "root",
})
export class SOService extends TableService<SOModel> {
  API_URL = "/warehouse/shipment-order";
  private _itemsFilter$ = new BehaviorSubject<any[]>([]);

  get itemsFilter$() {
    return this._itemsFilter$.asObservable();
  }
  constructor(private repository: SORepository, @Inject(AppHttpClient) http) {
    super(http);
  }

  //get list so
  find(tableState: ITableState): Observable<TableResponseModel<SOModel>> {
    const data = this.nomarlizedTableState(tableState);
    return this.repository.search(data).pipe(
      map((response: any) => {
        const result: TableResponseModel<any> = {
          items: response.data,
          total: response?.meta.itemCount,
        };
        return result;
      })
    );
  }

  updateSO(data: SOModel) {
    this.isLoading = true;
    return this.http
      .put(`${this.API_URL}`, data)
      .pipe(finalize(() => (this.isLoading = false)));
  }

  getDetailSO(data) {
    this.isLoading = true;
    return this.http
      .get(`${this.API_URL}/detail`, data)
      .pipe(finalize(() => (this.isLoading = false)));
  }

  cancelSO(data) {
    this.isLoading = true;
    return this.http
      .post(`${this.API_URL}/cancel`, data)
      .pipe(finalize(() => (this.isLoading = false)));
  }

  removeSODetail(data) {
    this.isLoading = true;
    return this.http.delete(`${this.API_URL}/detail`, data).pipe(
        finalize(() => this.isLoading = false)
    )
  }
}
