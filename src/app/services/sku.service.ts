import { SKUModel } from "../modules/warehouse/sku/models/sku.model";
import { AppHttpClient } from "./app-http.client.service";
import { Inject, Injectable } from "@angular/core";
import {
  ITableState,
  TableResponseModel,
  TableService,
} from "@app/_metronic/shared/crud-table";
import { Observable } from "rxjs";
import { map, finalize } from "rxjs/operators";
import { SkuRepository } from "@app/repositories/sku.repository";

@Injectable({
  providedIn: "root",
})
export class SkuService extends TableService<any> {
  API_URL = "/warehouse/items";

  constructor(private repository: SkuRepository, @Inject(AppHttpClient) http) {
    super(http);
  }

  find(tableState: ITableState): Observable<TableResponseModel<any>> {
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

  getSkuItemByCode(code: string, whseId: string) {
    this.isLoading = true;
    return this.repository.search({ code, whseId }).pipe(
      map((res: any) => res.data[0]),
      finalize(() => (this.isLoading = false))
    );
  }

  updateSkuItem(data: SKUModel) {
    this.isLoading = true;
    return this.http
      .put(`${this.API_URL}`, data)
      .pipe(finalize(() => (this.isLoading = false)));
  }

  deleteSkuItem(data: any) {
    this.isLoading = true;
    return this.http
      .delete(`${this.API_URL}`, data)
      .pipe(finalize(() => (this.isLoading = false)));
  }

  importExcel(data) {
    data = data.map((v) => {
      if (v["Nhóm vật tư"] === "PB") {
        return {
          groupCode: v["Nhóm vật tư"],
          name: v["Tên sản phẩm phân bón"],
          netWeight: Number(v["Khối lượng tịnh"]),
          weightUnit: v["Đơn vị khối lượng"],
          unit: v["Đơn vị đóng gói"],
          manufacture: v["Đơn vị sản xuất"],
          susr04: v["Công dụng chính"],
          susr05: v["Liều lượng sử dụng"],
          susr06: v["Lưu ý"],
          susr07: v["Xuất xứ"],
          susr08: v["Loại phân bón"],
          susr09: v["Thành phần"],
        };
      }
      if (v["Nhóm vật tư"] === "TBVTV") {
        return {
          groupCode: v["Nhóm vật tư"],
          name: v["Tên sản phẩm thuốc bảo vệ thực vật"],
          netWeight: Number(v["Khối lượng tịnh"]),
          weightUnit: v["Đơn vị khối lượng"],
          unit: v["Đơn vị đóng gói"],
          manufacture: v["Đơn vị sản xuất"],
          susr04: v["Công dụng chính"],
          susr05: v["Liều lượng sử dụng"],
          susr06: v["Lưu ý"],
          susr07: v["Xuất xứ"],
          susr09: v["Thành phần"],
        };
      }
      if (v["Nhóm vật tư"] === "X") {
        return {
          groupCode: v["Nhóm vật tư"],
          name: v["Tên xe"],
          grossWeight: v["Tải trọng xe"],
          netWeight: Number(v["Khối lượng xe"]),
          weightUnit: v["Đơn vị trọng lượng"],
          unit: v["Đơn vị tính"],
          manufacture: v["Thương hiệu"],
          susr04: v["Loại nhiên liệu"],
          susr05: v["Sức chứa nhiên liệu"],
          susr06: v["Công suất"],
          susr07: v["Đơn vị công suất"],
          susr08: v["Loại xe"],
          susr09: v["Đơn vị nhiên liệu"],
        };
      }
      if (v["Nhóm vật tư"] === "MM") {
        return {
          groupCode: v["Nhóm vật tư"],
          name: v["Tên máy"],
          netWeight: Number(v["Khối lượng máy"]),
          weightUnit: v["Đơn vị trọng lượng"],
          unit: v["Đơn vị tính"],
          manufacture: v["Thương hiệu"],
          susr04: v["Loại nhiên liệu"],
          susr05: v["Sức chứa nhiên liệu"],
          susr06: v["Công suất"],
          susr07: v["Đơn vị công suất"],
          susr08: v["Loại xe"],
          susr09: v["Đơn vị nhiên liệu"],
        };
      }
      if (v["Nhóm vật tư"] === "GL") {
        return {
          groupCode: v["Nhóm vật tư"],
          name: v["Tên giống lúa"],
          netWeight: Number(v["Khối lượng"]),
          weightUnit: v["Đơn vị trọng lượng"],
          unit: v["Đơn vị tính"],
          manufacture: v["Nguồn gốc"],
          susr04: v["Thời gian sinh trưởng"],
          susr05: v["Năng suất"],
          susr07: v["Điểm chống sâu bệnh"],
          susr08: v["Loại giống"],
        };
      }
    });
    // array item
    const importData = {
      whseId: "BFMS",
      storerKey: "FARM",
      items: data,
    };

    this.isLoading = true;
    return this.http
      .post(`/warehouse/import`, importData)
      .pipe(finalize(() => (this.isLoading = false)));
  }
}
