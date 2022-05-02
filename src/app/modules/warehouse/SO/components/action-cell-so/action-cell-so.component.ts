import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { BaseComponent } from "@app/modules/core/base/base.component";
import { ConfirmModalComponent } from "@app/modules/core/confirm-modal/confirm-modal.component";
import { ComponentService } from "@app/services/component.service";
import { SOService } from "@app/services/so.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SOModel } from "../../models/so.model";

@Component({
  selector: "app-action-cell-so",
  templateUrl: "./action-cell-so.component.html",
  styleUrls: ["./action-cell-so.component.scss"],
})
export class ActionCellSOComponent
  extends BaseComponent
  implements OnInit
{
  @Input() prop: any;

  constructor(
    private modalService: NgbModal,
    protected service: ComponentService,
    public ref: ChangeDetectorRef,
    private soService: SOService
  ) {
    super(service);
  }

  ngOnInit(): void {}

  delete(prop: SOModel) {
    const modalRef = this.modalService.open(ConfirmModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.info = {
      title: "Hủy phiếu xuất kho",
      content: "Bạn có muốn hủy phiếu xuất kho",
    };
    modalRef.closed.subscribe((v) => {
      if (v) {
        this.soService.cancelSO({
          orderIds: [
            prop.id
          ]
        }).subscribe(v => {
          this.service.alertFlashService.success(['Hủy thành công'], this.optionsAlert);
          this.soService.fetch();
        });
      }
    });
  }
}
