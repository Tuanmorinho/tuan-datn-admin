import { Component, Input, OnInit } from '@angular/core';
import { AlertFlashService } from '@app/services/alert-flash.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent implements OnInit {

  @Input() info: any;
  @Input() ids: any;
  bgColor: string = '#EB5757';
  @Input() iconStatus: string = 'delete';

  constructor(public modal: NgbActiveModal) { }

  ngOnInit(): void {
    if (this.iconStatus === 'delete' || this.iconStatus === 'cancel') {
      this.bgColor = '#EB5757';
    } else {
      this.bgColor = '#27AE60';
    }
  }
}
