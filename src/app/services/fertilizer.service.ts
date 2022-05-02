import { Inject, Injectable } from '@angular/core';
import { FertilizerRepository } from '@app/repositories/fertilizer.repository';
import { ITableState, TableResponseModel, TableService } from '@app/_metronic/shared/crud-table';
import { Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';
import { AppHttpClient } from './app-http.client.service';

@Injectable({
  providedIn: 'root'
})
export class FertilizerService extends TableService<any> {

  API_URL: string;

  constructor(
    private repository: FertilizerRepository,
    @Inject(AppHttpClient) http
  ) {
    super(http);
  }

  find(tableState: ITableState): Observable<TableResponseModel<any>> {
    const data = this.nomarlizedTableState(tableState);
    return this.repository.search(data).pipe(
      map((response: any) => {
        const result: TableResponseModel<any> = {
          items: response.data,
          total: response.meta?.itemCount,
        };
        return result;
      })
    );
  }
  
  getFertilizerByCode(code: string) {
    this.isLoading = true;
    return this.repository.search({ code }).pipe(
      map((res: any) => res.data[0]),
      finalize(() => this.isLoading = false)
    )
  }

  updateFertilizer(data: any) {
    this.isLoading = true;
    return this.http.put(this.API_URL, data).pipe(
      finalize(() => this.isLoading = false)
    );
  }

  createFertilizer(data: any) {
    this.isLoading = true;
    return this.http.post(this.API_URL, data).pipe(
      finalize(() => this.isLoading = false)
    );
  }
}
