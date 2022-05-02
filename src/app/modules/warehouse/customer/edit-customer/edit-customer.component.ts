import {
  ChangeDetectorRef,
  Component,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BaseComponent } from "@app/modules/core/base/base.component";
import { ComponentService } from "@app/services/component.service";
import { UploadFileService } from "@services/upload-file.service";
import { CustomerService } from '@app/services/customer.service';
import { InitDataService } from "@app/services/init-data.service";
import { cleanObject } from "@app/modules/core/utils/helpers";

@Component({
  selector: "edit-customer",
  templateUrl: "./edit-customer.component.html",
  styleUrls: ["./edit-customer.component.scss"],
})
export class EditCustomerComponent extends BaseComponent {

  formGroup: FormGroup;
  validTypeFiles = ["png", "jpg", "jpeg"];

  constructor(
    public customerService: CustomerService,
    private intitDataService: InitDataService,
    private fb: FormBuilder,
    protected service: ComponentService,
    protected uploadFileService: UploadFileService,
    public ref: ChangeDetectorRef
  ) {
    super(service);
  }

  async ngOnInit() {
    this.service.subheaderService.updateSubBreadcrumbs(
      [
        {
          title: "Danh sách khách hàng",
          linkPath: '/warehouse/customer',
        },
        {
          title: this.routeParams.id
            ? "Chỉnh sửa khách hàng"
            : "Thêm khách hàng",
          linkPath: this.router.url
        },
      ],
      'Trang chủ',
      [
        {
          name: "Hủy",
          class: "btn btn-outline-secondary mr-2",
          url: "/warehouse/customer",
        },
        {
          name: this.routeParams.id ? "Cập nhập" : "Lưu",
          class: "btn btn-primary",
          url: "#",
          isEvent: true,
          type: 'submit',
        },
      ],
      this.routeParams.id ? 'Chỉnh sửa thông tin khách hàng' : "Thêm khách hàng"
    );

    this.subscription = this.service.subheaderService.eventEmit.subscribe(v => {
      if (v === 'submit') {
        this.onSubmit();
      }
    })

    this.intitDataService.getWareHouse().subscribe(v => this.formGroup.patchValue({
      whseId: v[0]?.whseId,
      storerKey: v[0]?.storerKey
    }))

    this.formGroup = this.fb.group({
      code: [],
      whseId: [, Validators.required],
      storerKey: [, Validators.required],
      birthday: [],
      taxCode: [, Validators.required],
      email: [, [Validators.required, Validators.email]],
      name: [, Validators.required],
      phone: [, Validators.required],
      address: [, Validators.required],
      avatar: [],
      photo: []
    });
    const code = this.routeParams["id"];
    if (code) {
      this.customerService.getCustomerByCode(code).subscribe(v => {
        this.service.subheaderService.setDescription('Chỉnh sửa thông tin khách hàng: ' + v?.name);
        this.formGroup.patchValue({ 
          ...v
        });
        if (v.avatar?.fileKey) {
          const bucket = v.avatar?.bucket ? v.avatar?.bucket : '';
          const fileName = v.avatar?.fileKey ? v.avatar?.fileKey : '';
          this.uploadFileService.downloadFile(bucket, fileName).subscribe(x => {
            if (x) {
              this.formGroup.patchValue({
                photo: x
              });
              this.ref.detectChanges();
            }
          })
        } else {
          this.formGroup.patchValue({
            photo: null
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

    this.customerService.isLoading = true;

    if (this.v.photo) {
      try {
        const avatar: any = await this.uploadFileService.uploadFile(this.v.photo[0]);
        if (avatar) {
          this.formGroup.patchValue({
            avatar: {bucket: avatar?.bucket, fileKey: avatar?.key}
          })
        }
      } catch (_) {
        this.customerService.isLoading = false;
      }
    }

    const data = cleanObject(this.v);
    if (!data.birthday) {
      delete data.birthday;
    }
    if (!data.avatar?.fileKey) {
      delete data.avatar;
    }
    if (this.routeParams.id) {
      this.customerService.updateCustomer(data).subscribe(
        _ => {
          this.service.alertFlashService.success(
            ["Cập nhật khách hàng thành công"],
            this.optionsAlert
          );
          this.router.navigate(["/warehouse/customer"]);
        },
        (error) => {
          this.showError(error, this.ref);
        }
      );
    } else {
      this.customerService.create(data).subscribe(
        _ => {
          this.service.alertFlashService.success(
            ["Tạo khách hàng thành công"],
            this.optionsAlert
          );
          this.router.navigate(["/warehouse/customer"]);
        },
        (error) => {
          this.showError(error, this.ref);
        }
      );
    }
  }
}
