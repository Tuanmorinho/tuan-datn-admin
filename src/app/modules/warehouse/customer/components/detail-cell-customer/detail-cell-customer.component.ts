import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-detail-cell-customer',
  templateUrl: './detail-cell-customer.component.html',
  styleUrls: ['./detail-cell-customer.component.scss']
})
export class DetailCellCustomerComponent implements OnInit {
  @Input() prop: any;
  @Input() isModal: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

}
