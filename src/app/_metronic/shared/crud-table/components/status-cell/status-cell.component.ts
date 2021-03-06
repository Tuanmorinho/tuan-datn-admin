import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-status-cell',
  templateUrl: './status-cell.component.html',
  styleUrls: ['./status-cell.component.scss']
})
export class StatusCellComponent implements OnInit {

  @Input() prop : DeleteFlag
  constructor() { }

  ngOnInit() {
  }

}

interface DeleteFlag {
  deleteFlag: number
}
