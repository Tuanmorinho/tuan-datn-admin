import { Component, Inject, Input, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';

@Component({
  selector: '[app-detail-cell]',
  templateUrl: './detail-cell.component.html',
  styleUrls: ['./detail-cell.component.scss']
})
export class DetailCellComponent implements OnInit {

  @Input() prop: any;
  @Input() isModal: boolean = false;
  constructor() {

  }

  ngOnInit() {
  }

}
