import { Injectable } from "@angular/core";
import { Repository } from "@app/repositories/repository";
import { environment } from "environments/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class FarmRepository extends Repository {
  API_URL = `/household`;

  search(info: any): Observable<any[]> {    
    return this.httpClient.get(this.API_URL, info);
  }
  
}
