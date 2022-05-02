import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-detail-cell-supplier',
  templateUrl: './detail-cell-supplier.component.html',
  styleUrls: ['./detail-cell-supplier.component.scss']
})
export class DetailCellSupplierComponent implements OnInit {
  @Input() prop: any;
  constructor() { }

  ngOnInit(): void {}

}
