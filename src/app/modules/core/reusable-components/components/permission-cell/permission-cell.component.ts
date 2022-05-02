import { Component, Input, OnInit } from '@angular/core';
import { ComponentService } from '@services/component.service';
@Component({
  selector: 'permission-cell',
  templateUrl: './permisson-cell.component.html',
  styleUrls: ['./permission-cell.component.scss']
})
export class PermissionCellComponent implements OnInit {

  @Input() prop: any;
  @Input() dataKey: any;
  constructor(public service: ComponentService) { }


  /*
  * Use: declare name of permission in dataKey follow api response 
  */
  ngOnInit() {
  }

}
