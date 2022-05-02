import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-detail-cell-so',
  templateUrl: './detail-cell-so.component.html',
  styleUrls: ['./detail-cell-so.component.scss']
})
export class DetailCellSOComponent implements OnInit {
  @Input() prop: any;
  constructor() { }

  ngOnInit(): void {}

}
