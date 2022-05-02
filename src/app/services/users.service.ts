import { Inject, Injectable, OnDestroy } from "@angular/core";
import { UsersModel } from "@app/modules/users/_models/users.model";
import { UsersRepository } from "@app/repositories/users.repository";
import { ITableState, TableResponseModel, TableService } from "@app/_metronic/shared/crud-table";
import { environment } from "environments/environment";
import { BehaviorSubject, Observable } from "rxjs";
import { finalize, map } from "rxjs/operators";
import { AppHttpClient } from "./app-http.client.service";

@Injectable({
    providedIn: 'root'
})
export class UsersService extends TableService<UsersModel> implements OnDestroy {
    API_URL = `${environment.apiDevUrl}/auth/admin/realms/${environment.KEYCLOAK_REALM}`;

    private _itemsFilter$ = new BehaviorSubject<UsersModel[]>([]);

    get itemsFilter$() {
        return this._itemsFilter$.asObservable();
    }

    constructor(private repository: UsersRepository, @Inject(AppHttpClient) http) {
        super(http);
    }

    //get list user
    find(tableState: ITableState): Observable<TableResponseModel<UsersModel>> {
        const data = this.nomarlizedTableState(tableState);
        return this.repository.search(data).pipe(
            map((response: any) => {
                const result: TableResponseModel<UsersModel> = {
                    items: response,
                    total: response?.length
                };
                this._itemsFilter$.next(response);
                return result;
            }),
        );
    }

    getAllUsers() {
        return this.http.get(
            `${this.API_URL}/users`
        );
    }

    // get list role
    role(): Observable<any> {
        const params = {
            briefRepresentation: false,
            displayOnly: true
        }
        return this.http.get(this.API_URL + '/roles', params);
    }

    /**
     * get username by fullname and position
     * @param data
     * @returns 
     */
    getUsername(data: any) {
        this.isLoading = true;
        return this.http.put(this.API_URL + '/getusername', data).pipe(
            finalize(() => this.isLoading = false)
        )
    }

    getCurrentUser() {
        return this.http.get(this.API_URL + '/getcurrentuser');
    }

    getUserById(userId: string) {
        this.isLoading = true;
        return this.http.get(this.API_URL + '/users/' + userId).pipe(
            finalize(() => this.isLoading = false)
        );
    }

    create(item: any): Observable<any> {
        this.isLoading = true;
        return this.http.post(this.API_URL + '/users', item).pipe(
            finalize(() => this.isLoading = false)
        );
    }

    update(item: any): Observable<any> {
        this.isLoading = true;
        return this.http.put(this.API_URL + '/users/' + item.id, item).pipe(
            finalize(() => this.isLoading = false)
        );
    }

    deteleUser(userId: string) {
        this.isLoading = true;
        return this.http.delete(this.API_URL + '/users/' + userId).pipe(
            finalize(() => this.isLoading = false)
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }

    //get user role
    getUserRoles(): Observable<any> {
        let briefRepresentation = false;
        let displayOnly = true;
        this.isLoading = true;
        return this.http.get(`${environment.apiDevUrl}/auth/admin/realms/${environment.KEYCLOAK_REALM}/roles`, {briefRepresentation, displayOnly }).pipe(
            finalize(() => this.isLoading = false)
        );
    }

    // get history user
    getHistoryUser(idUser: any): Observable<any> {
        this.isLoading = true;
        return this.http.get(this.API_URL +'/users/'+ idUser + '/sessions').pipe(
            finalize(() => this.isLoading = false)
        );    
    }
}
