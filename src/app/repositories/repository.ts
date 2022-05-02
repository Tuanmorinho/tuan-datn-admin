import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppHttpClient } from '@app/services/app-http.client.service';

@Injectable()
export class Repository {
  protected baseUrl = 'assets/data';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(
    protected httpClient: AppHttpClient,
    protected http: HttpClient,
  ) {}

}
