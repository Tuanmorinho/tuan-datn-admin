import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ITableState, PaginatorState } from '@app/_metronic/shared/crud-table';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-basic-table-filter',
  templateUrl: './basic-table-filter.component.html',
  styleUrls: ['./basic-table-filter.component.scss']
})
export class BasicTableFilterComponent implements OnInit {

  @Input() page: ITableState;
  @Input() items: Observable<any>;
  @Input() columnsConfig: any[];
  @Input() isLoading: boolean = false;
  @Input() ids: any[] = [];
  @Input() isSelectedOnlyItem: boolean = false;

  @Output() rowSelected = new EventEmitter;
  @Output() outputPaginate: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

  selectAllRows() {
    this.page.grouping.selectAllDetailRows();
    this.rowSelected.emit(this.page.grouping.selectedRows);
  }

  select(item: any) {
    this.page.grouping.selectDetailRow(item);
    this.rowSelected.emit(this.page.grouping.selectedRows);
  }

  selectOnlyItem(item: any) {
    this.rowSelected.emit([item]);
  }

  paginate(paginator: PaginatorState) {
    this.outputPaginate.emit(paginator);
  }
}
