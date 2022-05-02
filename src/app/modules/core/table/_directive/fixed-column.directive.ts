import { Directive, ElementRef, Input, SimpleChanges } from '@angular/core';

@Directive({ selector: '[fixedColumn]' })
export class FixedColumnDirective {
    @Input() fixedColumn: boolean = false;
    @Input() columns: any[] = [];
    @Input() iColumn: number;

    constructor(private el: ElementRef) {
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.fixedColumn.currentValue) {
            if (this.el.nativeElement.tagName == 'TH') {
                this.el.nativeElement.style.backgroundColor = '#C9EDF9';
            }
            this.el.nativeElement.style.zIndex = '90';
            this.el.nativeElement.classList.add('position-sticky', 'selection-cell');
            this.el.nativeElement.style.left = this.calculatePosition(this.columns, this.iColumn);
        }
    }

    calculatePosition(columns: any[], index: number): string {
        return columns.reduce((prev, cur, curIndex) =>
            ((typeof cur.width === 'number') && curIndex < index) ? (prev + cur.width) : prev, 0) + 'px'
    }





}