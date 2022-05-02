import { Component, Input, OnInit } from '@angular/core';
import { LayoutService } from '@app/_metronic/core/services/layout.service';

@Component({
  selector: 'custom-offcanvas',
  templateUrl: './custom-offcanvas.component.html',
  styleUrls: ['./custom-offcanvas.component.scss'],
})
export class CustomOffcanvasComponent implements OnInit {
  extrasCustomOffcanvasDirection = 'offcanvas-right';
  @Input() component: any;
  @Input() filter: any;
  @Input() ids: any[];
  @Input() isSelectedOnlyItem: boolean;
  @Input() isForm: boolean;
  constructor() {}

  ngOnInit(): void {
  }
}
