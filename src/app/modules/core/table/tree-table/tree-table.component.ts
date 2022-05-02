import { Component, Input, OnInit } from '@angular/core';
import { ColumnConfig } from '@app/modules/core/table/_models/column.config';
import { Observable } from 'rxjs';

@Component({
    selector: 'tree-table',
    templateUrl: './tree-table.component.html',
    styleUrls: ['./tree-table.component.scss']
})

export class TreeTableComponent implements OnInit {
    @Input() items: Observable<any[]>;
    @Input() columns: ColumnConfig[] = [];
    offset: number;

    constructor() { }

    ngOnInit() { }
}