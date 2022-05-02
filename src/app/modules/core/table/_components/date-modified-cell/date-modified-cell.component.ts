import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: '[app-date-modified-cell]',
  templateUrl: './date-modified-cell.component.html',
  styleUrls: ['./date-modified-cell.component.scss']
})
export class DateModifiedCellComponent implements OnInit {

  @Input() prop: any
  constructor() { }

  ngOnInit() {
  }

}
