import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { BaseComponent } from "@app/modules/core/base/base.component";
import { ConfirmModalComponent } from "@app/modules/core/confirm-modal/confirm-modal.component";
import { ComponentService } from "@app/services/component.service";
import { SupplierService } from "@app/services/supplier.service";
import { UploadFileService } from "@app/services/upload-file.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SupplierModel } from "../models/supplier.model";

@Component({
  selector: "app-detail-supplier",
  templateUrl: "./detail-supplier.component.html",
  styleUrls: ["./detail-supplier.component.scss"],
})
export class DetailSupplierComponent extends BaseComponent implements OnInit {
  supplier: SupplierModel;
  imageUrl: string = "./assets/media/svg/icons/Common/Group.svg";

  constructor(
    public supplierService: SupplierService,
    protected service: ComponentService,
    private modalService: NgbModal,
    protected uploadFileService: UploadFileService,
    public ref: ChangeDetectorRef,
  ) {
    super(service);
  }

  ngOnInit(): void {
    this.service.subheaderService.updateBreadcrumbs([
      {
        title: "Danh sách nhà cung cấp",
        linkPath: '/warehouse/supplier',
      },
      {
        title: "Thông tin nhà cung cấp",
        linkPath: this.router.url,
        linkText: "Thông tin nhà cung cấp",
      },
    ],
    'Trang chủ',
    [
      {
        name: 'Thoát',
        url: '/warehouse/supplier',
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
        url: '/warehouse/supplier/edit/' + this.routeParams.code,
        class: 'btn btn-primary',
      }
    ], 'Chi tiết nhà cung cấp');
    this.subscription = this.service.subheaderService.eventEmit
    .subscribe(v => {
      if (v === 'delete') {
        this.delete();
      }
    });

    // get detail
    this.supplierService.getSuppliertByCode(this.routeParams.code).subscribe((v: SupplierModel) => {
      this.supplier = v;
      if (v.logo?.fileKey) {
        const bucket = v.logo?.bucket ? v.logo?.bucket : '';
        const fileName = v.logo?.fileKey ? v.logo?.fileKey : '';
        this.uploadFileService.downloadFile(bucket, fileName).subscribe(v => {
          if (v) {
            this.imageUrl = v;
            this.ref.detectChanges();
          }
        })
      }
    });

  }
  get f() {
    return this.formGroup.controls;
  }

  get v() {
    return this.formGroup.value;
  }

  delete() {
    const modalRef = this.modalService.open(ConfirmModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.info = {
      title: "Xóa nhà cung cấp",
      content: "Bạn có muốn xóa nhà cung cấp",
    };
    modalRef.closed.subscribe((v) => {
      if (v) {
        this.supplierService.deleteSupplier({
          whseId: 'BFMS',
          id: this.routeParams.id
        }).subscribe(v => {
          this.service.alertFlashService.success(['Xóa thành công'], this.optionsAlert);
          this.router.navigate(['/warehouse/supplier'])
        })
      }
    });
  }
}
