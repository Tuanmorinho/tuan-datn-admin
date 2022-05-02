import { CustomerService } from '@app/services/customer.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/modules/core/base/base.component';
import { ComponentService } from '@app/services/component.service';
import { UploadFileService } from '@app/services/upload-file.service';
import { CustomerModel } from '../models/customer.model';
import { ConfirmModalComponent } from '@app/modules/core/confirm-modal/confirm-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-detail-customer',
  templateUrl: './detail-customer.component.html',
  styleUrls: ['./detail-customer.component.scss']
})
export class DetailCustomerComponent extends BaseComponent {

  customer: CustomerModel;
  imageUrl: any = "./assets/media/svg/icons/Common/Group.svg";
  constructor(
    protected service: ComponentService,
    public customerService: CustomerService,
    protected uploadFileService: UploadFileService,
    public ref: ChangeDetectorRef,
    private modalService: NgbModal,
  ) {
    super(service);
  }

  ngOnInit(): void {
    this.service.subheaderService.updateBreadcrumbs([
      {
        title: "Danh mục khách hàng",
        linkPath: '/warehouse/customer',
      },
      {
        title: "Chi tiết khách hàng",
        linkPath: this.router.url,
      },
    ], "Trang chủ",
    [
      {
        name: 'Thoát',
        url: '/warehouse/customer',
        class: 'btn btn-outline-dark mr-3'
      },
      {
        name: 'Xóa',
        url: '#',
        class: 'btn btn-outline-danger mr-3',
        type: 'delete',
        isEvent: true
      },
      {
        name: 'Chỉnh sửa',
        url: '/warehouse/customer/edit/' + this.routeParams.code,
        class: 'btn btn-primary',
      }
    ], 'Chi tiết khách hàng');

    this.subscription = this.service.subheaderService.eventEmit
    .subscribe(v => {
      if (v === 'delete') {
        this.delete();
      }
    });

    this.customerService.getCustomerByCode(this.routeParams.code).subscribe((v: any) => {
      this.customer = v;
      if (v.avatar?.fileKey) {
        const bucket = v.avatar?.bucket ? v.avatar?.bucket : '';
        const fileName = v.avatar?.fileKey ? v.avatar?.fileKey : '';
        this.uploadFileService.downloadFile(bucket, fileName).subscribe(v => {
          if (v) {
            this.imageUrl = v;
            this.ref.detectChanges();
          }
        })
      }
    })
  }

  delete() {
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
          whseId: 'BFMS',
          id: this.routeParams.id
        }).subscribe(v => {
          this.service.alertFlashService.success(['Xóa thành công'], this.optionsAlert);
          this.router.navigate(['/warehouse/customer'])
        })
      }
    });
  }
}
