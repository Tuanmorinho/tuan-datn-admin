import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { HeaderConfig } from '@app/modules/core/table/setting-header-table/_models/header.config';

@Component({
    selector: '[setting-dropdown]',
    templateUrl: './dropdown.component.html',
    styleUrls: ['./dropdown.component.scss'],
})
export class SettingDropdownComponent {
    @ViewChild('card') card: ElementRef;

    @Input() headersConfig: HeaderConfig[];
    @Output() showFields = new EventEmitter<ShowFieldsEvent>();

    allComplete: boolean = false;
    hide: boolean = true;

    toogle() {
        this.hide = !this.hide;
    }

    updateAllComplete(header, val) {
        this.allComplete = this.headersConfig.every(t => t.isShowed);
        this.showFields.emit({ id: header, value: val })
    }

    someComplete(): boolean {        
        if (this.headersConfig == null) {
            return false;
        }
        return this.headersConfig.filter(t => t.isShowed).length > 0 && !this.allComplete;
    }

    setAll(isShowed: boolean) {
        this.allComplete = isShowed;
        if (this.headersConfig == null) {
            return;
        }
        this.headersConfig.forEach(t => (t.isShowed = isShowed));
    }
}


export interface ShowFieldsEvent {
    id: string;
    value: boolean
}