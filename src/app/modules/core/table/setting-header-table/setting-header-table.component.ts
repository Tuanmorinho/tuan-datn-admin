import { Component, Input, OnInit } from '@angular/core';
import { HeaderConfig } from '@app/modules/core/table/setting-header-table/_models/header.config';

@Component({
    selector: '[setting-header-table]',
    templateUrl: './setting-header-table.component.html',
    styleUrls: ['./setting-header-table.component.scss']
})

export class SettingHeaderTableComponent implements OnInit {
    @Input() headersConfig: HeaderConfig[];

    constructor(

    ) { }

    ngOnInit() { }
}