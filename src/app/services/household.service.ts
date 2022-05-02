import { Inject, Injectable, OnDestroy } from "@angular/core";
import { FarmRepository } from "@app/repositories/farm.repository";
import {
  ITableState,
  TableResponseModel,
  TableService,
} from "@app/_metronic/shared/crud-table";
import { Observable } from "rxjs";
import { finalize, map } from "rxjs/operators";
import { AppHttpClient } from "./app-http.client.service";

@Injectable({
  providedIn: "root",
})
export class HouseholdService extends TableService<any> {
  API_URL = "/household";

  constructor(private repository: FarmRepository, @Inject(AppHttpClient) http) {
    super(http);
  }

  //get list household
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

  getHouseholdById(bookCode: string) {
    this.isLoading = true;
    return this.http.get(this.API_URL + '/' + bookCode).pipe(
      finalize(() => this.isLoading = false)
    );
  }

  getBankAccounts(idHousehold: any) {
    this.isLoading = true;
    return this.http.get(this.API_URL + '/' + idHousehold + '/bank-accounts').pipe(
      finalize(() => this.isLoading = false)
    );
  }

  //get household List
  getHouseholdList(): Observable<any[]> {
    let info = { page: 1, take: 100, status: 'ACTIVE' };
    return this.http.get(this.API_URL, info);
  }

  getListUsers() {
    return this.http.get(this.API_URL + '/users');
  }

  updateMemberInfo(data: any, householdId) {
    this.isLoading = true;
    return this.http.put(`${this.API_URL}/${householdId}/members/${data.id}`, data).pipe(
      finalize(() => this.isLoading = false)
    );
  }

  createMemberInfo(data: any, householdId) {
    this.isLoading = true;
    data.identifyType = 'CCCD';
    data.role = 'MEMBER';
    return this.http.post(`${this.API_URL}/${householdId}/members`, data).pipe(
      finalize(() => this.isLoading = false)
    );
  }

  deleteMemberInfo(memberId: number, householdId: number) {
    this.isLoading = true;
    return this.http.delete(`${this.API_URL}/${householdId}/members/${memberId}`).pipe(
      finalize(() => this.isLoading = false)
    );
  }

  changeStatus(id: number, status: string) {
    this.isLoading = true;
    return this.http.put(`${this.API_URL}/${id}/status`, { status }).pipe(
      finalize(() => this.isLoading = false)
    );
  }
}
