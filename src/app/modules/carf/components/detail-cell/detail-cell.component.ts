import { Component, Inject, Input, OnInit } from '@angular/core';

@Component({
  selector: '[app-detail-cell]',
  templateUrl: './detail-cell.component.html',
  styleUrls: ['./detail-cell.component.scss']
})
export class DetailCellComponent implements OnInit {

  @Input() prop: any;
  constructor() {

  }

  ngOnInit() {
  }

}
