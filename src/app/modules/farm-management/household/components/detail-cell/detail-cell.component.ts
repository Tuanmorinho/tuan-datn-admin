import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-household-detail-cell',
  templateUrl: './detail-cell.component.html',
  styleUrls: ['./detail-cell.component.scss']
})
export class HouseHoldDetailcellComponent implements OnInit {
  @Input() prop: any;
  @Input() isModal: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

}
