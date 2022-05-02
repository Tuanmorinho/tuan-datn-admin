import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-detail-cell-farming-contracts',
  templateUrl: './detail-cell-farming-contracts.component.html',
  styleUrls: ['./detail-cell-farming-contracts.component.scss']
})
export class DetailCellFarmingContractsComponent implements OnInit {
  @Input() prop: any;
  @Input() isModal: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

}
