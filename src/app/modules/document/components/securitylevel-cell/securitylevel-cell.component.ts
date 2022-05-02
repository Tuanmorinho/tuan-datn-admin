import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: '[app-securitylevel-cell]',
  templateUrl: './securitylevel-cell.component.html',
  styleUrls: ['./securitylevel-cell.component.scss']
})
export class SecuritylevelCellComponent implements OnInit {

  @Input() prop: any;
  constructor() { }

  ngOnInit() {
  }

}
