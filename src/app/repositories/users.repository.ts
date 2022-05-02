import { Injectable } from "@angular/core";
import { Repository } from "@app/repositories/repository";
import { Observable } from "rxjs";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root",
})
export class UsersRepository extends Repository {
  search(info: any): Observable<any[]> {
    return this.httpClient.get(
      `${environment.apiDevUrl}/auth/admin/realms/${environment.KEYCLOAK_REALM}/users`,
      info,
    );
  }
}
