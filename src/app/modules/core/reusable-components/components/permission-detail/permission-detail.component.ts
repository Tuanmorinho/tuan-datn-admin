import { Component,Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-permission-detail',
  templateUrl: './permission-detail.component.html'
})
export class PermissionDetailComponent implements OnInit {

  @Input() title: string = '';
  @Input() document: any;
  @Input() name: string = '';

  constructor() { }
  
  ngOnInit(): void {}
}
