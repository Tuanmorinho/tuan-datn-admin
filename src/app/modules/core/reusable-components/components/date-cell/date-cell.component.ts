import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: '[app-date-cell]',
  templateUrl: './date-cell.component.html'
})
export class DateCellComponent implements OnInit {

  @Input() prop: any;
  constructor() {}


  ngOnInit() {
  }

}
