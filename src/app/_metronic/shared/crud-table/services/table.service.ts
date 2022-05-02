// tslint:disable:variable-name
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { PaginatorState } from '../models/paginator.model';
import { ITableState, TableResponseModel } from '../models/table.model';
import { BaseModel } from '../models/base.model';
import { SortState } from '../models/sort.model';
import { GroupingState } from '../models/grouping.model';
import { environment } from '../../../../../environments/environment';
import { AppHttpClient } from '@app/services/app-http.client.service';
import { formatDate } from '@angular/common';
import { ExpandState } from '@app/_metronic/shared/crud-table';
import { PermissionData } from '@app/modules/core/interfaces/interfaces';

const DEFAULT_STATE: ITableState = {
  filter: {},
  paginator: new PaginatorState(),
  sorting: new SortState(),
  searchTerm: '',
  grouping: new GroupingState(),
  expanding: new ExpandState(),
  entityId: undefined
};

export abstract class TableService<T> {
  // Private fields
  private _items$ = new BehaviorSubject<T[]>([]);
  private _isLoading$ = new BehaviorSubject<boolean>(false);
  private _isFirstLoading$ = new BehaviorSubject<boolean>(true);
  private _tableState$ = new BehaviorSubject<ITableState>(DEFAULT_STATE);
  private _errorMessage = new BehaviorSubject<string>('');
  private _subscriptions: Subscription[] = [];

  // Getters
  get items$() {
    return this._items$.asObservable();
  }
  get isLoading$() {
    return this._isLoading$.asObservable();
  }
  get isFirstLoading$() {
    return this._isFirstLoading$.asObservable();
  }
  get errorMessage$() {
    return this._errorMessage.asObservable();
  }
  get subscriptions() {
    return this._subscriptions;
  }

  setTableState(data: any) {
    this._tableState$.next(data);
  }


  //Setters
  set items(val: T[]) {
    this._items$.next(val);
  }
  set isLoading(val: boolean) {
    this._isLoading$.next(val);
  }
  set isFirstLoading(val: boolean) {
    this._isFirstLoading$.next(val);
  }
  set errorMessage(val: string) {
    this._errorMessage.next(val);
  }

  // State getters
  get paginator() {
    return this._tableState$.value.paginator;
  }
  get filter() {
    return this._tableState$.value.filter;
  }
  get sorting() {
    return this._tableState$.value.sorting;
  }
  get searchTerm() {
    return this._tableState$.value.searchTerm;
  }
  get grouping() {
    return this._tableState$.value.grouping;
  }

  get expanding() {
    return this._tableState$.value.expanding;
  }

  get items() {
    return this._items$.value;
  }

  protected http: AppHttpClient;
  // API URL has to be overrided
  API_URL = `${environment.apiUrl}/endpoint`;
  constructor(http: AppHttpClient) {
    this.http = http;
  }

  // CREATE
  // server should return the object with ID
  create(item: any): Observable<BaseModel> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    return this.http.post<BaseModel>(`${this.API_URL}`, item).pipe(
      finalize(() => this._isLoading$.next(false))
    );
  }

  // READ (Returning filtered list of entities)
  search(data: any): Observable<any> {
    const url = this.API_URL + '/search';
    this._errorMessage.next('');
    return this.http.post<TableResponseModel<T>>(url, data).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        return of({ items: [], total: 0 });
      })
    );
  }

  // READ (Returning filtered list of entities)
  find(tableState: ITableState): Observable<TableResponseModel<T>> {
    const url = this.API_URL + '/search';
    this._errorMessage.next('');
    return this.http.post<TableResponseModel<T>>(url, tableState).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('FIND ITEMS', err);
        return of({ items: [], total: 0 });
      })
    );
  }

  getItemById(id: number): Observable<BaseModel> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const url = `${this.API_URL}/${id}`;
    return this.http.get<BaseModel>(url).pipe(
      finalize(() => this._isLoading$.next(false))
    );
  }

  selectItems(params?: any): Observable<BaseModel> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const url = `${this.API_URL}/select`;
    return this.http.get<BaseModel>(url, params).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        return of({ id: undefined });
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }

  getAll(params?: any): Observable<BaseModel> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const url = `${this.API_URL}/getall`;
    return this.http.get<BaseModel>(url, params).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        return of({ id: undefined });
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }

  // UPDATE
  update(item: any): Observable<any> {
    const url = `${this.API_URL}/${item.id}`;
    this._isLoading$.next(true);
    this._errorMessage.next('');
    return this.http.put(url, item).pipe(
      finalize(() => this._isLoading$.next(false))
    );
  }

  // UPDATE Status
  updateStatusForItems(ids: number[], status: number): Observable<any> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const body = { ids, status };
    const url = this.API_URL + '/updateStatus';
    return this.http.put(url, body).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('UPDATE STATUS FOR SELECTED ITEMS', ids, status, err);
        return of([]);
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }

  // DELETE
  delete(id: any): Observable<any> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const url = `${this.API_URL}/${id}`;
    return this.http.delete(url).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('DELETE ITEM', id, err);
        return of({});
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }

  // delete list of items
  deleteItems(ids: number[] = []): Observable<any> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const url = this.API_URL + '/delete';
    const body = { ids };
    return this.http.put(url, body).pipe(
      finalize(() => this._isLoading$.next(false))
    );
  }

  public fetch() {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const request = this.find(this._tableState$.value)
      .pipe(
        tap((res: TableResponseModel<T>) => {
          this._items$.next(res.items);
          this.patchStateWithoutFetch({
            paginator: this._tableState$.value.paginator.recalculatePaginator(
              res.total
            ),
          });
        }),
        catchError((err) => {
          this._errorMessage.next(err);
          return of({
            items: [],
            total: 0
          });
        }),
        finalize(() => {
          this._isLoading$.next(false);
          const items = this._items$.value.map((el: T) => {
            const item = (el as unknown) as BaseModel;
            return item;
          });
          this.patchStateWithoutFetch({
            grouping: this._tableState$.value.grouping.clearRows(items),
            expanding: this._tableState$.value.expanding.selectAll(items),
          });
        })
      )
      .subscribe();
    this._subscriptions.push(request);
  }

  public setDefaults() {
    this.patchStateWithoutFetch({ filter: {} });
    this.patchStateWithoutFetch({ sorting: new SortState() });
    this.patchStateWithoutFetch({ grouping: new GroupingState() });
    this.patchStateWithoutFetch({ expanding: new ExpandState() });
    this.patchStateWithoutFetch({ searchTerm: '' });
    this.patchStateWithoutFetch({
      paginator: new PaginatorState()
    });
    this._isFirstLoading$.next(true);
    this._isLoading$.next(true);
    this._tableState$.next(DEFAULT_STATE);
    this._errorMessage.next('');
  }

  // Base Methods
  public patchState(patch: Partial<ITableState>) {
    this.patchStateWithoutFetch(patch);
    this.fetch();
  }

  public patchStateWithoutFetch(patch: Partial<ITableState>) {
    const newState = Object.assign(this._tableState$.value, patch);
    this._tableState$.next(newState);
  }

  public nomarlizedTableState(tableState: ITableState) {
    let params = {};
    params['page'] = tableState.paginator.page;
    params['take'] = tableState.paginator.pageSize;

    if (Object.keys(tableState.sorting).length !== 0 && tableState.sorting.column != 'No') {
      params['sort'] = tableState.sorting.direction === 'desc' ? '-' + tableState.sorting.column : tableState.sorting.column;
      // params['sort'] = [{
      //   column: tableState.sorting.column,
      //   isAcsending: tableState.sorting.direction === 'asc' ? true : false
      // }];
    }
    if (Object.keys(tableState.filter).length !== 0) {
      for (let key in tableState.filter) {
        params[key] = typeof tableState.filter[key] === "string" ? tableState.filter[key].trim() : tableState.filter[key];
      }
    }
    return params;
  }

  compareDateTime(date1, date2) {
    date1 = formatDate(date1, 'yyyy-MM-dd HH:mm', 'vi_VI')
    date2 = formatDate(date2, 'yyyy-MM-dd HH:mm', 'vi_VI')
    if (date1 > date2) return true
    else return false
  }

  compareDates(date1, date2) {
    date1 = formatDate(date1, 'yyyy-MM-dd', 'vi_VI')
    date2 = formatDate(date2, 'yyyy-MM-dd', 'vi_VI')
    if (date1 > date2) return true
    else return false
  }

  compareQuarter(q1, q2) {
    if (Number(q1) > Number(q2)) return true;
    else return false;
  }

  formatDate(date: string) {
    if (!date) return null;
    return formatDate(date, 'yyyy-MM-ddTHH:mm', 'vi_VI');
  }
}
