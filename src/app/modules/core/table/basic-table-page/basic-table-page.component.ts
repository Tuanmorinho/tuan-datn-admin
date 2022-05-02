import {animate, style, transition, trigger} from '@angular/animations';
import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ColumnConfig} from '@app/modules/core/table/_models/column.config';
import {SelectionModalService} from '@app/services/selection-modal.service';
import {
    GroupingState,
    IDeleteAction,
    IDeleteSelectedAction,
    IEditAction,
    IFetchSelectedAction,
    IGroupingView,
    ISortView,
    IUpdateStatusForSelectedAction,
    PaginatorState,
    SortState
} from '@app/_metronic/shared/crud-table';
import {ExpandState, IExpandView} from '@app/_metronic/shared/crud-table/models/expand.model';
import {Observable, Subscription} from 'rxjs';

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
    hasSelectionModalService: boolean;
}

@Component({
    selector: 'basic-table-page',
    templateUrl: './basic-table-page.component.html',
    styleUrls: ['./basic-table-page.component.scss'],
    animations: [
        trigger(
            'enterAnimation', [
                transition(':enter', [
                    style({transform: 'scaleY(0%)', opacity: 0}),
                    animate('150ms ease-in', style({transform: 'scaleY(100%)', opacity: 1}))
                ])
            ]
        )
    ],
})
export class BasicTablePageComponent implements IBasicTable,
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

    @Output() outputSort: EventEmitter<any> = new EventEmitter();
    @Output() outputEdit: EventEmitter<any> = new EventEmitter();
    @Output() outputDelete: EventEmitter<any> = new EventEmitter();
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

    @Input() set ids(ids: any[]) {
        if (this.grouping) {
            this.grouping.selectedRows = ids;
        }

    }

    @Input() isExpand: boolean = false;
    @Input() hasScrollbarX: boolean = false;
    @Input() isHideEditBtn: boolean = false;
    @Input() isHideDeleteBtn: boolean = false;
    @Input() hasSelectionModalService: boolean = true;
    @Input() isApprove: boolean = false;

    private subscriptions: Subscription[] = [];
    offset: number;
    subHeaders: any[];

    constructor(private selectionModalService: SelectionModalService
    ) {
    }

    expand: ExpandState;

    ngOnInit() {


        this.selectionModalService.selectedItems = [];
        this.offset = (this.paginator.page - 1) * this.paginator.pageSize + 1;
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
        this.outputSort.emit({sorting});
    }

    // pagination
    paginate(paginator: PaginatorState) {
        this.offset = (paginator.page - 1) * paginator.pageSize + 1;
        this.outputSort.emit({paginator});
    }

    ngOnDestroy() {
        this.subscriptions.forEach((sb) => sb.unsubscribe());
    }

    delete(data: any, isChild = false) {
        data.isChild = isChild;
        this.outputDelete.emit(data);
    }

    edit(id: number) {
        this.outputEdit.emit(id);
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
        this.grouping.clearGrouping();
        this.grouping.selectDetailRow(item);
        this.outputRowSelected.emit(item);
        if (this.hasSelectionModalService) {
            this.selectionModalService.selectedItems = [item];
            this.selectionModalService.onCloseModal();
        }
    }

    expandRow(id) {
        this.expanding.selectRow(id);
    }
}
