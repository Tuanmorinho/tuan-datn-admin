import { ConfirmModalComponent } from './../../../../core/confirm-modal/confirm-modal.component';
import { Component, Input, OnInit } from "@angular/core";
import { BaseComponent } from "@app/modules/core/base/base.component";
import { ComponentService } from "@app/services/component.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { POModel } from '../../model/po.model';
import { POService } from '@app/services/po.service';

@Component({
  selector: "app-action-cell-po",
  templateUrl: "./action-cell.component.html",
  styleUrls: ["./action-cell.component.scss"],
})
export class ActionCellPOComponent
  extends BaseComponent
  implements OnInit
{
  @Input() prop: any;

  constructor(
    private modalService: NgbModal,
    protected service: ComponentService,
    public POService: POService,
  ) {
    super(service);
  }

  ngOnInit(): void {}

  delete(prop: POModel) {
    const modalRef = this.modalService.open(ConfirmModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.info = {
      title: "Hủy phiếu nhập kho",
      content: "Bạn có muốn hủy phiếu nhập kho",
    };
    modalRef.closed.subscribe((v) => {
      if (v) {
        this.POService.cancelPO({
          receiptIds: [
            prop.id
          ]
        }).subscribe(v => {
          this.service.alertFlashService.success(['Hủy thành công'], this.optionsAlert);
          this.POService.fetch();
        });
      }
    });
  }
}
