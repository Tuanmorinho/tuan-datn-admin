import { Inject, Injectable } from '@angular/core';
import { FarmingContractsRepository } from '@app/repositories/farming-contracts.repository';
import { ITableState, TableResponseModel, TableService } from '@app/_metronic/shared/crud-table';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { AppHttpClient } from './app-http.client.service';

@Injectable({
  providedIn: 'root'
})
export class FarmingContractsService extends TableService<any> {
  API_URL = `/household/farming-contracts`;

  constructor(private repository: FarmingContractsRepository, @Inject(AppHttpClient) http) {
    super(http);
  }

  //get list contracts
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
}
