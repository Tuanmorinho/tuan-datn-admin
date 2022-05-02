import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams,
  HttpErrorResponse,
  HttpHeaders,
  HttpEvent
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { HttpErrorHandler } from './http-error-handler.service';
import { catchError, timeout } from 'rxjs/operators';
import { LocalStorageService } from './storage.service';
import { environment } from '../../environments/environment';

@Injectable()
export class AppHttpClient {
  static prefix = environment.apiUrl;

  /**
   * AppHttpClient Constructor.
   */
  constructor(
    protected httpClient: HttpClient,
    protected errorHandler: HttpErrorHandler,
    private storageService: LocalStorageService,
  ) { }

  public get<T>(uri: string, params = {}, configs: any = {}): Observable<T> {
    const httpParams = this.generateHttpParams(params);
    return this.httpClient
      .get<T>(this.prefixUri(uri), {
        reportProgress: configs.reportProgress,
        params: httpParams,
        headers: this.generateHttpHeaders(configs.headers)
      })
      .pipe(catchError((err, caught) => this.handleError(err)));
  }

  public post<T>(
    uri: string,
    params: object = null,
    configs: any = {}
  ): Observable<T> {
    return this.httpClient
      .post<T>(this.prefixUri(uri), params, {
        reportProgress: configs.reportProgress,
        headers: this.generateHttpHeaders(configs.headers)
      })
      .pipe(catchError((err, caught) => this.handleError(err)));
  }

  public postWithProgress<T>(
    uri: string,
    params: object = null,
    configs: any = {}
  ): Observable<T | HttpEvent<T>> {
    return this.httpClient
      .post<T>(this.prefixUri(uri), params, {
        reportProgress: configs.reportProgress,
        observe: configs.observe,
        headers: this.generateHttpHeaders(configs.headers)
      })
      .pipe(catchError((err, caught) => this.handleError(err)));
  }

  public put<T>(uri: string, params: object = {}): Observable<T> {
    return this.httpClient
      .put<T>(this.prefixUri(uri), params, {
        headers: this.generateHttpHeaders()
      })
      .pipe(catchError((err, caught) => this.handleError(err)));
  }

  public patch<T>(uri: string, params: object = {}): Observable<T> {
    return this.httpClient
      .patch<T>(this.prefixUri(uri), params, {
        headers: this.generateHttpHeaders()
      })
      .pipe(catchError((err, caught) => this.handleError(err)));
  }

  // public delete<T>(uri: string, params?: any): Observable<T> {
  //   return this.httpClient
  //     .delete<T>(this.prefixUri(uri), 
  //     {
  //       headers: this.generateHttpHeaders(),
  //       params
  //     })
  //     .pipe(catchError((err, caught) => this.handleError(err)));
  // }

  public delete<T>(uri: string, body?: any): Observable<any> {
    return this.httpClient
      .request('delete', this.prefixUri(uri), 
      {
        headers: this.generateHttpHeaders(),
        body
      })
      .pipe(catchError((err, caught) => this.handleError(err)));
  }

  /**
   * Prefix specified uri with backend API prefix.
   */
  private prefixUri(uri: string) {
    if (uri.includes('http')) {
      return uri;
    }
    return AppHttpClient.prefix + uri;
  }

  /**
   * Generate http params for GET request.
   */
  private generateHttpParams(params: object) {
    let httpParams = new HttpParams();
    for (let key in params) {
      httpParams = httpParams.append(key, params[key]);
    }

    return httpParams;
  }

  //TODO: request interceptor
  private generateHttpHeaders(headerInfo?: object, body?: object) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    if (this.storageService.get('access_token')) {

      headers = headers.set(
        'Authorization',
        `Bearer ${this.storageService.get('access_token')}`
      );
    }

    if (headerInfo) {
      for (let header of Object.keys(headerInfo)) {
        if (headerInfo[header]) {
          headers = headers.set(header, headerInfo[header]);
        } else {
          headers = headers.delete(header);
        }
      }
    }
    

    return headers;
  }

  private handleError(error: HttpErrorResponse) {
    return this.errorHandler.handle(error);
  }
}
