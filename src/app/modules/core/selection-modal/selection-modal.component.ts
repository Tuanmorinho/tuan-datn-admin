import { LocationStrategy } from '@angular/common';
import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SelectionModalService } from '@app/services/selection-modal.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

@Component({
    selector: 'selection-modal',
    templateUrl: './selection-modal.component.html',
    styleUrls: ['./selection-modal.component.scss']
})

export class SelectionModalComponent implements OnInit, OnDestroy {
    @Input() component: any;
    @Input() filter: any;
    @Input() ids: any[];
    @Input() isSelectedOnlyItem: boolean;
    @Input() isForm: boolean;
    static counter: number = 0;
    private subsciption: Subscription = new Subscription();
    private currentCounter: number;
    constructor(public modal: NgbActiveModal, private selectionModalService: SelectionModalService, private location: LocationStrategy) {
        history.pushState(null, null, window.location.href);
        this.location.onPopState(() => {
            history.pushState(null, null, window.location.href);
        });
        this.selectionModalService.isCloseModal$.subscribe(res => {
            this.closeModal();
        })

        SelectionModalComponent.counter++;
    }

    @HostListener('window:popstate', ['$event'])
    onPopState(event) {
        event.preventDefault();
        this.modal.close();
    }

    closeModal() {
        if (this.currentCounter === SelectionModalComponent.counter) {
            SelectionModalComponent.counter--;
            this.currentCounter--;
            const sb = this.selectionModalService.selectedItems$.subscribe(item => this.modal.close(item));
            this.subsciption.add(sb);
        }
    }
    formGroup: FormGroup;
    ngOnInit() {
        this.currentCounter = SelectionModalComponent.counter;
    }

    ngOnDestroy(): void {
        this.subsciption.unsubscribe();
        // this.selectionModalService.selectedItems = [];

    }
}
