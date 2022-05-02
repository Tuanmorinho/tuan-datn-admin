import { Injectable } from "@angular/core";
import { Repository } from "@app/repositories/repository";
import { environment } from "environments/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SupplierRepository extends Repository {
  API_URL = "/warehouse";

  search(info: any): Observable<any[]> {    
    return this.httpClient.get(this.API_URL + '/suppliers', info);
  }
  
}
