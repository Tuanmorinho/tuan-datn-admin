export interface IExpandState {
    selectedRowIds: Set<number>;
    itemIds: number[];
    checkAreAllRowsSelected(): boolean;
    selectRow(id: number): IExpandState;
    // tslint:disable-next-line:variable-name
    clearRows(_itemIds: number[]): IExpandState;
    isRowSelected(id: number): boolean;
    getSelectedRows(): number[];
    getSelectedRowsCount(): number;
}

export class ExpandState implements IExpandState {
    selectedRowIds: Set<number> = new Set<number>();
    itemIds = [];

    checkAreAllRowsSelected(): boolean {
        if (this.itemIds.length === 0) {
            return false;
        }

        return this.selectedRowIds.size === this.itemIds.length;
    }

    selectRow(id: number): ExpandState {
        if (this.selectedRowIds.has(id)) {
            this.selectedRowIds.delete(id);
        } else {
            this.selectedRowIds.add(id);
        }
        return this;
    }

    // tslint:disable-next-line:variable-name
    clearRows(_itemIds: number[]): ExpandState {
        this.itemIds = _itemIds;
        this.selectedRowIds = new Set<number>();
        return this;
    }

    selectAll(_items: any[]): ExpandState {
        this.clearAllRows();
        this.itemIds = _items.map(item => item.id);
        this.itemIds.forEach(id => this.selectedRowIds.add(id));
        return this;
    }

    clearAllRows() {
        this.selectedRowIds = new Set<number>();
    }

    isRowSelected(id: number): boolean {
        return this.selectedRowIds.has(id);
    }

    selectAllRows(): ExpandState {
        const areAllSelected = this.itemIds.length === this.selectedRowIds.size;
        if (areAllSelected) {
            this.selectedRowIds = new Set<number>();
        } else {
            this.selectedRowIds = new Set<number>();
            this.itemIds.forEach(id => this.selectedRowIds.add(id));
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

export interface IExpandView {
    expand: ExpandState;
    ngOnInit(): void;
}
