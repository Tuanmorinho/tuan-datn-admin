import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: '[app-date-created-cell]',
  templateUrl: './date-created-cell.component.html',
  styleUrls: ['./date-created-cell.component.scss']
})
export class DateCreatedCellComponent implements OnInit {

  @Input() prop: any
  constructor() { }

  ngOnInit() {
  }

}
