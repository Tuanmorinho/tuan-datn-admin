import { Inject, Injectable } from "@angular/core";
import {
  TableService,
} from "@app/_metronic/shared/crud-table";
import { finalize } from "rxjs/operators";
import { AppHttpClient } from "./app-http.client.service";

@Injectable({
  providedIn: "root",
})
export class InitDataService extends TableService<any> {
  API_URL = "/household";

  constructor(@Inject(AppHttpClient) http) {
    super(http);
  }

  //get init data (banks)
  getInitDataHouseHold() {
    this.isLoading = true;
    return this.http.get('/household/init-data').pipe(
      finalize(() => this.isLoading = false)
    )
  }

  getInitDataDetailHousehold(id) {
    this.isLoading = true;
    return this.http.get('/household/init-data/' + id + '/children').pipe(
      finalize(() => this.isLoading = false)
    );
  }


  getWareHouse() {
    this.isLoading = true;
    return this.http.get('/warehouse').pipe(
      finalize(() => this.isLoading = false)
    );
  }

  getInitDataWareHouse() {
    this.isLoading = true;
    return this.http.get('/warehouse/init-data').pipe(
      finalize(() => this.isLoading = false)
    );
  }
}
