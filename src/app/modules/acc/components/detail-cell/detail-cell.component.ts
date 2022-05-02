import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: '[app-detail-cell]',
  templateUrl: './detail-cell.component.html',
  styleUrls: ['./detail-cell.component.scss']
})
export class ACCDetailCellComponent implements OnInit {

  @Input() prop: any;
  constructor() {

  }

  ngOnInit() {
  }

}
