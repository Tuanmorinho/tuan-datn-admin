import { Component, Input, OnInit } from '@angular/core';
import { AlertFlashService } from '@app/services/alert-flash.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss']
})
export class DeleteModalComponent implements OnInit {

  @Input() info: any;
  @Input() ids: any;
  @Input() baseService: any;
  @Input() bgColor: string = '#F64E60';

  constructor(public modal: NgbActiveModal, private alertFlashService: AlertFlashService) { }

  ngOnInit(): void {
  }

  delete() {
    this.alertFlashService.clear();
    this.baseService.deteleUser(this.ids).subscribe(res => {
      this.alertFlashService.success(['Xoá thành công'], {
        autoClose: true,
        keepAfterRouteChange: false
      });
      this.modal.close(true);
    }, (error: any) => {
      this.modal.close({error});
    });
  }

  ngOnDestroy(): void {
  }
}
