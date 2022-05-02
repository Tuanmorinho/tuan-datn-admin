import { CustomerService } from './../../../../../services/customer.service';
import { ConfirmModalComponent } from './../../../../core/confirm-modal/confirm-modal.component';
import { Component, Input, OnInit } from "@angular/core";
import { BaseComponent } from "@app/modules/core/base/base.component";
import { ComponentService } from "@app/services/component.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CustomerModel } from '../../models/customer.model';

@Component({
  selector: "app-action-cell-customer",
  templateUrl: "./action-cell-customer.component.html",
  styleUrls: ["./action-cell-customer.component.scss"],
})
export class ActionCellCustomerComponent
  extends BaseComponent
  implements OnInit
{
  @Input() prop: any;

  constructor(
    private modalService: NgbModal,
    protected service: ComponentService,
    public customerService: CustomerService,
  ) {
    super(service);
  }

  ngOnInit(): void {}

  delete(prop: CustomerModel) {
    const modalRef = this.modalService.open(ConfirmModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.info = {
      title: "Xóa khách hàng",
      content: "Bạn có muốn xóa khách hàng",
    };
    modalRef.closed.subscribe((v) => {
      if (v) {
        this.customerService.deleteCustomer({
          id: prop.id,
          whseId: 'BFMS'
        }).subscribe(v => {
          this.service.alertFlashService.success(['Xóa thành công'], this.optionsAlert);
          this.customerService.fetch();
        });
      }
    });
  }
}
