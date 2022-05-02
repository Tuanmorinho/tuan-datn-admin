import { Inject, Injectable } from "@angular/core";
import { ITEM_GROUP } from "@app/modules/core/utils/constants";
import { SupplierModel } from "@app/modules/warehouse/supplier/models/supplier.model";
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
export class SupplierService extends TableService<SupplierModel> {
  API_URL = "/warehouse/suppliers";
  API_WAREHOUSE = "/warehouse";
  private _itemsFilter$ = new BehaviorSubject<any[]>([]);

  get itemsFilter$() {
    return this._itemsFilter$.asObservable();
  }
  constructor(
    private repository: SupplierRepository,
    @Inject(AppHttpClient) http
  ) {
    super(http);
  }

  //get list supplier
  find(tableState: ITableState): Observable<TableResponseModel<SupplierModel>> {
    const data = this.nomarlizedTableState(tableState);
    return this.repository.search(data).pipe(
      map((response: any) => {
        const data = response.data.map((x) => {
          if (x.groupCodes) {
            let groupName = x.groupCodes
              .map((v) => {
                return ITEM_GROUP.find((y) => y.code === v)?.name;
              })
              .join(", ");
            return { ...x, groupItemNames: groupName };
          } else {
            return { ...x };
          }
        });

        const result: TableResponseModel<any> = {
          items: data,
          total: response?.meta.itemCount,
        };
        this._itemsFilter$.next(response.data);
        return result;
      })
    );
  }

  //get detail supplier
  getSuppliertByCode(code: string) {
    this.isLoading = true;
    const data = {
      code,
      whseId: "BFMS",
    };
    return this.repository.search(data).pipe(
      map((response: any) => {
        const supplier = response.data[0];
        if (supplier.groupCodes) {
          let groupName = supplier.groupCodes
            .map((v) => ITEM_GROUP.find((y) => y.code === v)?.name)
            .join(", ");
          return { ...supplier, groupName };
        } else {
          return { ...supplier };
        }
      }),
      finalize(() => (this.isLoading = false))
    );
  }

  update(item: any): Observable<any> {
    this.isLoading = true;
    return this.http
      .put(this.API_URL, item)
      .pipe(finalize(() => (this.isLoading = false)));
  }

  deleteSupplier(data: any) {
    this.isLoading = true;
    return this.http
      .delete(this.API_URL, data)
      .pipe(finalize(() => (this.isLoading = false)));
  }

  importExcel(data) {
    // mapping data
    data = data.map((v) => {
      return {
        name: v["Tên"],
        email: v["Email"],
        phone: v["Số điện thoại"],
        taxCode: v["Mã số thuế"],
        address: v["Địa chỉ"],
        groupCodes: (v['Loại vật tư cung cấp'] + '').split(',').map(v => v.trim())
      };
    });
    // array item
    const importData = {
      whseId: "BFMS",
      items: data,
    };

    this.isLoading = true;
    return this.http
      .post(`${this.API_URL}/import`, importData)
      .pipe(finalize(() => (this.isLoading = false)));
  }
}
