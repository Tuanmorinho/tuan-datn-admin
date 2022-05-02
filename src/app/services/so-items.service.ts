import { Inject, Injectable } from "@angular/core";
import {
  TableService,
} from "@app/_metronic/shared/crud-table";
import { AppHttpClient } from "./app-http.client.service";

@Injectable({
  providedIn: "root",
})
export class ItemSOService extends TableService<any> {
  constructor(@Inject(AppHttpClient) http) {
    super(http);
  }
}
