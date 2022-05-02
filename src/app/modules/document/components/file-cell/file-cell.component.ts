import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: '[app-file-cell]',
  templateUrl: './file-cell.component.html',
  styleUrls: ['./file-cell.component.scss']
})
export class FileCellComponent implements OnInit {

  @Input() prop: any;
  constructor() { }

  ngOnInit() {
  }

}
