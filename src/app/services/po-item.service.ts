import { Inject, Injectable } from "@angular/core";
import { ItemPOModel } from "@app/modules/warehouse/po/model/po.model";
import {
  TableService,
} from "@app/_metronic/shared/crud-table";
import { AppHttpClient } from "./app-http.client.service";

@Injectable({
  providedIn: "root",
})
export class ItemPOService extends TableService<ItemPOModel> {
  constructor(@Inject(AppHttpClient) http) {
    super(http);
  }
}
