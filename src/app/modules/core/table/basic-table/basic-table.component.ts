import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { SettingDropdownComponent, ShowFieldsEvent } from '@app/modules/core/table/setting-header-table/_components/dropdown/dropdown.componnent';
import { ColumnConfig } from '@app/modules/core/table/_models/column.config';
import { SelectionModalService } from '@app/services/selection-modal.service';
import { GroupingState, IDeleteAction, IDeleteSelectedAction, IEditAction, IFetchSelectedAction, IGroupingView, ISortView, IUpdateStatusForSelectedAction, PaginatorState, SortState } from '@app/_metronic/shared/crud-table';
import { ExpandState, IExpandView } from '@app/_metronic/shared/crud-table/models/expand.model';
import { Observable, Subscription } from 'rxjs';

export interface IBasicTable {
  outputEdit: EventEmitter<any>;
  outputDelete: EventEmitter<any>;
  outputSort: EventEmitter<any>;
  outputDeleteSelected: EventEmitter<any>;
  outputSelectedMultiRows: EventEmitter<any>;
  items: Observable<any[]>;
  columns: ColumnConfig[];
  grouping: any;
  expanding: any;
  paginator: any;
  sorting: any;
  isLoading: boolean;
  ids?: number[];
  isModal?: boolean;
  isSelectedOnlyItem?: boolean;
  isExpand?: boolean;
  hasScrollbarX?: boolean;
  isHideEditBtn?: boolean;
  isHideDeleteBtn?: boolean;
  isHideImportBtn?: boolean;
  hasSelectionModalService: boolean;
}

@Component({
  selector: 'basic-table',
  templateUrl: './basic-table.component.html',
  styleUrls: ['./basic-table.component.scss'],
  animations: [
    trigger(
      'enterAnimation', [
      transition(':enter', [
        style({ transform: 'scaleY(0%)', opacity: 0 }),
        animate('150ms ease-in', style({ transform: 'scaleY(100%)', opacity: 1 }))
      ])
    ]
    )
  ],
})
export class BasicTableComponent implements
  IBasicTable,
  IEditAction,
  IDeleteAction,
  IDeleteSelectedAction,
  IFetchSelectedAction,
  IUpdateStatusForSelectedAction,
  OnInit,
  OnDestroy,
  ISortView,
  IGroupingView,
  IExpandView {

  @ViewChild('scroller') scroller: ElementRef;
  @ViewChild('tableContainer') tableContainer: ElementRef;
  @ViewChild('table') table: ElementRef;
  @ViewChild(SettingDropdownComponent) settingDropdown: SettingDropdownComponent;

  @Output() outputSort: EventEmitter<any> = new EventEmitter();
  @Output() outputEdit: EventEmitter<any> = new EventEmitter();
  @Output() outputDelete: EventEmitter<any> = new EventEmitter();
  @Output() outputImport: EventEmitter<any> = new EventEmitter();
  @Output() outputDeleteSelected: EventEmitter<any> = new EventEmitter();
  @Output() outputSelectedMultiRows: EventEmitter<any> = new EventEmitter();
  @Output() outputRowSelected: EventEmitter<any> = new EventEmitter();


  @Input() items: Observable<any[]>;
  @Input() columns: ColumnConfig[] = [];
  @Input() grouping: GroupingState;
  @Input() paginator: PaginatorState;
  @Input() sorting: SortState;
  @Input() expanding: ExpandState;
  @Input() isLoading: boolean = false;
  @Input() isModal: boolean = false;
  @Input() isSelectedOnlyItem: boolean = false;
  @Input() ids: any[];
  @Input() isExpand: boolean = false;
  @Input() hasScrollbarX: boolean = false;
  @Input() isHideEditBtn: boolean = false;
  @Input() isHideDeleteBtn: boolean = false;
  @Input() isHideImportBtn: boolean = false;
  @Input() hasSelectionModalService: boolean = true;
  @Input() isApprove: boolean = false;

  private subscriptions: Subscription[] = [];
  offset: number;
  subHeaders: any[];
  widthScrollbar: string;
  enabledScroller: boolean = true;

  constructor(private selectionModalService: SelectionModalService
  ) {
  }
  expand: ExpandState;

  ngOnInit() {
    if (this.isExpand) {
      this.expanding.selectAllRows();
    }

    this.selectionModalService.selectedItems = [];
    this.offset = (this.paginator.page - 1) * this.paginator.pageSize + 1;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.grouping?.currentValue || changes.ids?.currentValue) {
      if (this.grouping) this.grouping.selectedRows = this.ids || [];
    }

    if (changes.columns?.currentValue || changes.columns?.currentValue) {
      for (let column of this.columns) if (column.isShowed === undefined) column.isShowed = true
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.table.nativeElement.offsetWidth === this.tableContainer.nativeElement.offsetWidth) this.enabledScroller = false;
      else {
        this.widthScrollbar = this.table.nativeElement.offsetWidth + 'px'
      }
    }, 0)
  }

  // sorting
  sort(column: string) {
    const sorting = this.sorting;
    const isActiveColumn = sorting.column === column;
    if (!isActiveColumn) {
      sorting.column = column;
      sorting.direction = 'asc';
    } else {
      sorting.direction = sorting.direction === 'asc' ? 'desc' : 'asc';
    }
    this.outputSort.emit({ sorting });
  }

  // pagination
  paginate(paginator: PaginatorState) {
    this.offset = (paginator.page - 1) * paginator.pageSize + 1;
    if (this.isExpand) this.expanding.clearAllRows()
    this.outputSort.emit({ paginator });
  }

  ngOnDestroy() {
    this.grouping.clearGrouping();
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  delete(data: any, isChild = false) {
    data.isChild = isChild;
    this.outputDelete.emit(data)
  }

  edit(id: number) {
    this.outputEdit.emit(id);
  }

  import(data: any) {
    this.outputImport.emit(data);
  }

  deleteSelected() {
    this.outputDeleteSelected.emit(this.grouping.selectedRowIds);
  }

  onSelectedIMultiRows() {
    this.outputSelectedMultiRows.emit(this.grouping.selectedRowIds);
  }

  fetchSelected() {
  }

  updateStatusForSelected() {

  }

  select(item: any) {
    this.grouping.selectDetailRow(item);

    this.selectionModalService.selectedItems = this.grouping.selectedRows;

    this.outputRowSelected.emit(this.grouping.selectedRows);
  }

  selectAllDetailRows() {
    this.grouping.selectAllDetailRows();
    this.selectionModalService.selectedItems = this.grouping.selectedRows;
    this.outputRowSelected.emit(this.grouping.selectedRows);
  }

  selectOnlyItem(item: any) {
    this.grouping.selectDetailRow(item);
    this.outputRowSelected.emit(item);
    if (this.hasSelectionModalService) {
      this.selectionModalService.selectedItems = [item];
      this.selectionModalService.onCloseModal();
    }
  }

  expandRow(id) {
    this.expanding.selectRow(id)
  }

  openSettingTable() {
    this.settingDropdown.hide = !this.settingDropdown.hide;
  }

  showFields(event: ShowFieldsEvent) {
    this.columns.find(header => header.label == event.id).isShowed = event.value;
    for (let header of this.columns) {
      if (header.label === event.id) {
        header.isShowed = event.value;
      }
    }
  }

  scroll(elementRef) {
    if (elementRef === 'scroller') {
      this[elementRef]?.nativeElement.scrollTo(this.tableContainer.nativeElement.scrollLeft, 0)
    } else {
      this[elementRef]?.nativeElement.scrollTo(this.scroller.nativeElement.scrollLeft, 0)
    }
  }

}
