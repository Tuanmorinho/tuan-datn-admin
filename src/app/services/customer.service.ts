import { CustomerRepository } from './../repositories/customer.repository';
import { AppHttpClient } from './app-http.client.service';
import { Inject, Injectable } from '@angular/core';
import { ITableState, TableResponseModel, TableService } from '@app/_metronic/shared/crud-table';
import { Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class CustomerService extends TableService<any> {
    API_URL = '/warehouse/customers';

    constructor(
        private repository: CustomerRepository,
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
                    total: response?.meta.itemCount,
                };
                return result;
            }),
        );
    }

    getCustomerByCode(code: string) {
        this.isLoading = true;
        const data = {
            code,
            whseId: "BFMS"
        }
        return this.repository.search(data).pipe(
            map((res: any) => res.data[0]),
            finalize(() => this.isLoading = false)
        )
    }

    updateCustomer(data: any) {
        this.isLoading = true;
        return this.http.put(`${this.API_URL}`, data).pipe(
            finalize(() => this.isLoading = false)
        );
    }

    deleteCustomer(data: any) {
        this.isLoading = true;
        return this.http.delete(`${this.API_URL}`, data).pipe(
            finalize(() => this.isLoading = false)
        );
    }

    importExcel(data) {
        // mapping data
        data = data.map(v => {
            return {
                name: v['Tên'],
                email: v['Email'],
                phone: v['Số điện thoại'],
                taxCode: v['Mã số thuế'],
                birthday: v['Ngày sinh'] ? new Date(`${v['Ngày sinh']}, UTC`).toISOString() : '',
                address: v['Địa chỉ']
            }
        });
        // array item
        const importData = {
            whseId: 'BFMS',
            items: data
        }

        this.isLoading = true;
        return this.http.post(`${this.API_URL}/import`, importData).pipe(
            finalize(() => this.isLoading = false)
        );
    }
}