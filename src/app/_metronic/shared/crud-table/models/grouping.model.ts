export interface IGroupingState {
  selectedRowIds: Set<number>;
  selectedRows: Array<any>;
  itemIds: number[];
  items: any[];
  checkAreAllRowsSelected(): boolean;
  selectRow(id: number): IGroupingState;
  // tslint:disable-next-line:variable-name
  selectDetailRow(item: any): IGroupingState;
  clearRows(_items: any[]): IGroupingState;
  isRowSelected(id: number): boolean;
  selectAllRows(): IGroupingState;
  selectAllDetailRows(): IGroupingState;
  getSelectedRows(): number[];
  getSelectedRowsCount(): number;
}

export class GroupingState implements IGroupingState {
  selectedRowIds: Set<number> = new Set<number>();
  selectedRows: Array<any> = [];
  itemIds = [];
  items = [];


  checkAreAllRowsSelected(): boolean {
    if (this.itemIds.length === 0) {
      return false;
    }

    return this.selectedRowIds.size === this.itemIds.length;
  }

  checkAreAllDetailRowsSelected(): boolean {
    if (this.items.length === 0) {
      return false;
    }

    return this.selectedRows.length === this.items.length;
  }

  selectRow(id: number): GroupingState {
    if (this.selectedRowIds.has(id)) {
      this.selectedRowIds.delete(id);
    } else {
      this.selectedRowIds.add(id);
    }
    return this;
  }

  selectDetailRow(item: any) {
    if (this.selectedRows.some(row => row.id === item.id)) this.selectedRows = this.selectedRows.filter(row => row.id !== item.id);
    else this.selectedRows.push(item);
    return this;
  }

  // tslint:disable-next-line:variable-name
  clearRows(_items: any[]): GroupingState {
    this.itemIds = _items.map(item => item.id);
    this.items = _items;
    return this;
  }

  clearGrouping(): void {
    this.selectedRowIds = new Set<number>();
    this.selectedRows = [];
  }

  isRowSelected(id: number): boolean {
    return this.selectedRowIds.has(id);
  }

  isDetailRowSelected(id: number): boolean {
    return this.selectedRows.some(row => row.id === id || row === id);
  }

  selectAllRows(): GroupingState {
    const areAllSelected = this.itemIds.length === this.selectedRowIds.size;
    if (areAllSelected) {
      this.selectedRowIds = new Set<number>();

    } else {
      this.selectedRowIds = new Set<number>();
      this.itemIds.forEach(id => this.selectedRowIds.add(id));
    }
    return this;
  }

  selectAllDetailRows(): GroupingState {
    const areAllSelected = this.itemIds.length === this.selectedRowIds.size;

    this.selectedRowIds = new Set<number>();
    this.selectedRows = [];

    if (!areAllSelected) {
      this.itemIds.forEach(id => this.selectedRowIds.add(id));
      this.selectedRows = [...this.items];
    }
    return this;
  }

  getSelectedRows(): number[] {
    return Array.from(this.selectedRowIds);
  }

  getSelectedRowsCount(): number {
    return this.selectedRowIds.size;
  }
}

export interface IGroupingView {
  grouping: GroupingState;
  ngOnInit(): void;
}
