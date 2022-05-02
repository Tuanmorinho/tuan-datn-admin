import { Injectable } from "@angular/core";
import { UsersModel } from "@app/modules/users/_models/users.model";
import { Repository } from "@app/repositories/repository";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class UserRoleRepository extends Repository {
    API_URL = '/userrole'

    search(info: any): Observable<UsersModel[]> {
        return this.httpClient.post(`${this.API_URL}/search`, info);
    }
}