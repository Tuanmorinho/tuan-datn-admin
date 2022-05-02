import { Inject, Injectable, OnDestroy } from "@angular/core";
import { TableService } from "@app/_metronic/shared/crud-table";
import { Observable, of } from "rxjs";
import { finalize, map } from "rxjs/operators";
import { AppHttpClient } from "./app-http.client.service";
import { environment } from 'environments/environment';
import { UserRoleModel } from "@app/modules/users/user-role/_models/role-role.model";

@Injectable({
    providedIn: 'root'
})
export class UserRoleService extends TableService<UserRoleModel> implements OnDestroy {
    API_URL = `${environment.apiDevUrl}/auth/admin/realms/${environment.KEYCLOAK_REALM}`;
    constructor(@Inject(AppHttpClient) http) {
        super(http);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }

    //get user role
    getUserRoles(): Observable<any> {
        let briefRepresentation = false;
        let displayOnly = true;
        this.isLoading = true;
        return this.http.get(`${this.API_URL}/roles`, { briefRepresentation, displayOnly }).pipe(
            finalize(() => this.isLoading = false)
        );
    }

    //get Permission
    getPermission(): Observable<any> {
        this.isLoading = true;
        return this.http.get(`${this.API_URL}/clients/${environment.APP_CLIENT}/roles?briefRepresentation=false`).pipe(
            finalize(() => this.isLoading = false)
        )
    }

    //get List Permission active
    getListPermissionActive(id: any): Observable<any> {
        this.isLoading = true;
        return this.http.get(`${this.API_URL}/roles-by-id/${id}/composites/clients/${environment.APP_CLIENT}`).pipe(
            finalize(() => this.isLoading = false)
        )
    }

    //get list item check 
    getcheckList(id): Observable<any> {
        this.isLoading = true;
        return this.http.get(`${this.API_URL}/roles-by-id/${id}/composites`).pipe(
            finalize(() => this.isLoading = false)
        )
    }

    //assign data into permissionList

    setPermission(data, groupId: string): Observable<any> {
        this.isLoading = true;
        return this.http.post<boolean>(`${this.API_URL}/roles-by-id/${groupId}/clients/${environment.APP_CLIENT}/composites`, data).pipe(
            finalize(() => this.isLoading = false)
        );
    }

    createRole(data) {
        this.isLoading = true;
        return this.http.post(`${this.API_URL}/roles`, { ...data, attributes: { display: [true] } }).pipe(
            finalize(() => this.isLoading = false)
        );
    }

    updateRole(data) {
        this.isLoading = true;
        return this.http.put(`${this.API_URL}/roles-by-id/${data.id}`, data).pipe(
            finalize(() => this.isLoading = false)
        );
    }

    deleteRole(roleId: string) {
        this.isLoading = true;
        return this.http.delete(`${this.API_URL}/roles-by-id/${roleId}`).pipe(
            finalize(() => this.isLoading = false)
        );
    }
}