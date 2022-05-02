import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Repository } from './repository';

@Injectable({
  providedIn: 'root'
})
export class FertilizerRepository extends Repository {
  API_URL = `/household/farming-contracts`;

  search(info: any): Observable<any[]> {    
    return this.httpClient.get(this.API_URL + '/list', info);
  }
  
}
