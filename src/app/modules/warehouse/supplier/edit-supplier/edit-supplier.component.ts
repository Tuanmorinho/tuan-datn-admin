import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BaseComponent } from "@app/modules/core/base/base.component";
import { ITEM_GROUP } from "@app/modules/core/utils/constants";
import { ComponentService } from "@app/services/component.service";
import { SupplierService } from "@app/services/supplier.service";
import { UploadFileService } from "@app/services/upload-file.service";
import { WarehouseInitService } from "@app/services/warehouse-init.service";
import { ItemGroupModel } from "../../sku/models/item-group.model";
import { WarehouseModel } from "../../sku/models/warehouse.model";
import { SupplierModel } from "../models/supplier.model";

@Component({
  selector: "app-edit-supplier",
  templateUrl: "./edit-supplier.component.html",
  styleUrls: ["./edit-supplier.component.scss"],
})
export class EditSupplierComponent extends BaseComponent {
  itemGroups: ItemGroupModel[] = ITEM_GROUP;
  warehouses: WarehouseModel[] = [];
  supplier: SupplierModel;
  formGroup: FormGroup;

  validTypeFiles = ["png", "jpg", "jpeg"];

  companies = [];
  constructor(
    public supllierService: SupplierService,
    public warehouseInitService: WarehouseInitService,
    private fb: FormBuilder,
    protected service: ComponentService,
    protected uploadFileService: UploadFileService,
    public ref: ChangeDetectorRef
  ) {
    super(service);
  }

  async ngOnInit() {
    const code = this.routeParams['code'];
    this.service.subheaderService.updateBreadcrumbs(
      [
        {
          title: "Danh sách nhà cung cấp",
          linkPath: '/warehouse/supplier',
        },
        {
          title: code ? "Sửa nhà cung cấp" : "Thêm nhà cung cấp",
          linkPath: this.router.url
        },
      ],
      "Trang chủ",
      [
        {
          name: "Hủy",
          class: "btn btn-outline-secondary mr-2",
          url: "/warehouse/supplier",
        },
        {
          name: code ? "Cập nhập" : "Lưu",
          class: "btn btn-primary",
          url: "#",
          isEvent: true,
          type: 'submit',
        },
      ],
      code ? 'Chỉnh sửa nhà cung cấp' : "Thêm nhà cung cấp"
    );
    this.subscription = this.service.subheaderService.eventEmit.subscribe(v => {
      if (v === 'submit') {
        this.onSubmit();
      }
    })
    this.warehouseInitService.getWarehouse().subscribe((x) => {
      this.formGroup.patchValue({
        whseId: x[0]?.whseId,
        storerKey: x[0]?.storerKey
      })
    });

    this.formGroup = this.fb.group({
      id: [],
      code: [],
      name: [, Validators.required],
      groupCodes: [, [Validators.required]],
      taxCode: [, Validators.required],
      email: [, Validators.required],
      phone: [, Validators.required],
      address: [, Validators.required],
      whseId: [],
      storerKey: [],
      logo: [],
      photo: []
    });
    if (code) {
      this.supllierService
        .getSuppliertByCode(code)
        .subscribe(async (v: any) => {
          this.service.subheaderService.setDescription('Chỉnh sửa thông tin nhà cung cấp: ' + v?.name);
          this.supplier = v;
          this.formGroup.patchValue({
            ...v
          });
          if (v.logo?.fileKey) {
            const bucket = v.logo?.bucket ? v.logo?.bucket : "";
            const fileName = v.logo?.fileKey ? v.logo?.fileKey : "";
            this.uploadFileService.downloadFile(bucket, fileName).subscribe((x) => {
              this.formGroup.patchValue({
                photo: x
              });
              this.ref.detectChanges();
            });
          } else {
            this.formGroup.patchValue({
              logo: null
            });
          }
        });
    }
  }

  get f() {
    return this.formGroup.controls;
  }

  get v() {
    return this.formGroup.value;
  }

  async onSubmit() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.invalid) {
      return;
    }

    if (this.v.logo) {
      try {
        this.supllierService.isLoading = true;
        const logo: any = await this.uploadFileService.uploadFile(this.v.logo[0]);
        if (logo) {
          this.formGroup.patchValue({
            logo: { bucket: logo?.bucket, fileKey: logo?.key },
          });
        }
      } catch (error) {
        this.supllierService.isLoading = false;
        return null;
      }
    }
    const data = this.v;
    if (this.routeParams.code) {
      this.supllierService.update(data).subscribe(
        (res) => {
          this.service.alertFlashService.success(
            ["Cập nhật nhà cung cấp thành công"],
            this.optionsAlert
          );
          this.router.navigate(["/warehouse/supplier"]);
        },
        (error) => {
          this.showError(error, this.ref);
        }
      );
    } else {
      this.supllierService.create(data).subscribe(
        (res) => {
          this.service.alertFlashService.success(
            ["Tạo nhà cung cấp thành công"],
            this.optionsAlert
          );
          this.router.navigate(["/warehouse/supplier"]);
        },
        (error) => {
          this.showError(error, this.ref);
        }
      );
    }
  }
}
