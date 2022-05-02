import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-detail-cell-sku',
  templateUrl: './detail-cell-sku.component.html',
  styleUrls: ['./detail-cell-sku.component.scss']
})
export class DetailCellSkuComponent implements OnInit {
  @Input() prop: any;
  @Input() isModal: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }
}
