import { Component, Input } from '@angular/core';
import { NgbPopoverConfig, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'info-popover',
    templateUrl: './info-popover.component.html',
    styleUrls: ['./info-popover.component.scss'],
    providers: [NgbPopoverConfig]
})
export class InfoPopoverComponent {

    @Input() content: string = '';
    @Input() title: string = '';

    constructor(config: NgbPopoverConfig) {
        config.placement = 'right';
        config.triggers = 'hover';
    }
}