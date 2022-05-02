import { Injectable } from "@angular/core";
import { TableService } from "@app/_metronic/shared/crud-table";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class TableExcelService extends TableService<any> {
    private _itemsFilter$ = new BehaviorSubject<any[]>([]);

    get itemsFilter$() {
        return this._itemsFilter$.asObservable();
    }

    itemsFilter(val: any) {
        this._itemsFilter$.next(val);
    }
}