import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-alert-modal',
  templateUrl: './alert-modal.component.html'
})
export class AlertModalComponent implements OnInit {

  @Input() info: any;
  @Input() bgColor: string = '#2c70e6';

  constructor(public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }
}
