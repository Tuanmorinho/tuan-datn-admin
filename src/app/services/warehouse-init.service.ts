import { Inject, Injectable } from '@angular/core';
import { TableService } from '@app/_metronic/shared/crud-table';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AppHttpClient } from './app-http.client.service';

@Injectable({
  providedIn: 'root'
})
export class WarehouseInitService extends TableService<any> {
  API_URL = "/warehouse";

  constructor(@Inject(AppHttpClient) http) {
    super(http);
  }

  //get init data
  getInitDataWarehose() {
    this.isLoading = true;
    return this.http.get(this.API_URL + '/init-data').pipe(
      finalize(() => this.isLoading = false)
    )
  }

  getInitDataDetail(id) {
    this.isLoading = true;
    return this.http.get(this.API_URL + '/init-data/' + id + '/children').pipe(
      finalize(() => this.isLoading = false)
    );
  }

  getWarehouse() {
    this.isLoading = true;
    return this.http.get(this.API_URL).pipe(
      finalize(() => this.isLoading = false)
    );
  }

  getItems() {
    this.isLoading = true;
    return this.http.get(this.API_URL + '/items/' + '?whseId=BFMS')
  }

}
