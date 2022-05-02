import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { BaseComponent } from "@app/modules/core/base/base.component";
import { ConfirmModalComponent } from "@app/modules/core/confirm-modal/confirm-modal.component";
import { DeleteModalComponent } from "@app/modules/core/delete-modal/delete-modal.component";
import { ComponentService } from "@app/services/component.service";
import { SupplierService } from "@app/services/supplier.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SupplierModel } from "../../models/supplier.model";

@Component({
  selector: "app-action-cell-supplier",
  templateUrl: "./action-cell-supplier.component.html",
  styleUrls: ["./action-cell-supplier.component.scss"],
})
export class ActionCellSupplierComponent
  extends BaseComponent
  implements OnInit
{
  @Input() prop: any;

  constructor(
    private modalService: NgbModal,
    protected service: ComponentService,
    public ref: ChangeDetectorRef,
    private supplierService: SupplierService
  ) {
    super(service);
  }

  ngOnInit(): void {}

  delete(prop: SupplierModel) {
    const modalRef = this.modalService.open(ConfirmModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.info = {
      title: "Xóa nhà cung cấp",
      content: "Bạn có muốn xóa nhà cung cấp " + prop.name,
    };
    modalRef.closed.subscribe((v) => {
      if (v) {
        this.supplierService
          .deleteSupplier({ id: prop.id, whseId: "BFMS" })
          .subscribe((v) => {
            this.service.alertFlashService.success(
              ["Xóa thành công"],
              this.optionsAlert
            );
            this.router.navigate(["/warehouse/supplier"]);
            this.supplierService.fetch();
          });
      }
    });
  }
}
