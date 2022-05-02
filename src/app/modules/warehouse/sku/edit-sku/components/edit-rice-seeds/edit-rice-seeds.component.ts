import { BaseComponent } from './../../../../../core/base/base.component';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { InitDataService } from '@app/services/init-data.service';
import { InitDataModel } from '../../../models/init-data.model';
import { SkuService } from '@app/services/sku.service';
import { UploadFileService } from '@app/services/upload-file.service';
import { ComponentService } from '@app/services/component.service';

@Component({
  selector: 'app-edit-rice-seeds',
  templateUrl: './edit-rice-seeds.component.html',
  styleUrls: ['./edit-rice-seeds.component.scss']
})
export class EditRiceSeedsComponent extends BaseComponent implements OnInit {
  @Input() formGroup: FormGroup;

  initDataWarehouse: InitDataModel;

  constructor(
    private initDataService: InitDataService,
    public ref: ChangeDetectorRef,
    public skuService: SkuService,
    private uploadFileService: UploadFileService,
    protected service: ComponentService
  ) {
    super(service)
  }

  ngOnInit(): void {
    this.initDataService.getInitDataWareHouse().subscribe((v: InitDataModel) => {
      this.initDataWarehouse = v;
      this.ref.detectChanges();
    })
  }


  get v() {
    return this.formGroup.value;
  }

  get f() {
    return this.formGroup.controls;
  }

  async onSubmit() {
    this.formGroup.patchValue({
      netWeight: 1,
      weightUnit: this.initDataWarehouse?.weightUnits[0]?.code,
      unit: this.initDataWarehouse?.units[0]?.code,
      susr06: "empty",
      susr09: "empty"
    })

    this.formGroup.markAllAsTouched();
    if (this.formGroup.invalid) {
      return;
    }

    this.skuService.isLoading = true;

    let files = [];
    let images = [];
    try {
      if (this.v.files) {
        for (const item of this.v.files) {
          const file: any = await this.uploadFileService.uploadFile(item);
          if (file && file.key) {
            files.push({
              bucket: file?.bucket,
              fileKey: file?.key,
            })
            this.formGroup.patchValue({
              files
            })
          } else {
            files.push({
              bucket: item?.bucket,
              fileKey: item?.fileKey,
            })
            this.formGroup.patchValue({
              files
            })
          }
        }
      }
      if (this.v.images) {
        for (const item of this.v.images) {
          const image: any = await this.uploadFileService.uploadFile(item);
          if (image && image.key) {
            images.push({
              bucket: image?.bucket,
              fileKey: image?.key,
            })
            this.formGroup.patchValue({
              images
            })
          } else {
            images.push({
              bucket: item?.bucket,
              fileKey: item?.fileKey,
            })
            this.formGroup.patchValue({
              images
            })
          }
        }
      }
    } catch (error) {
      this.skuService.isLoading = false;
    }

    if (this.v.groupCode === 'GL') {
      let data = this.v;
      delete data.photos;
      this.submit(data);
    }

  }

  submit(data) {
    if (this.routeParams.id) {
      this.skuService.updateSkuItem(data).subscribe(
        _ => {
          this.service.alertFlashService.success(
            ["Cập nhật vật tư thành công"],
            this.optionsAlert
          );
          this.router.navigate(["/warehouse/sku"], { queryParams: { p: data?.groupCode } });
        },
        (error) => {
          this.showError(error, this.ref);
        }
      );
    } else {
      this.skuService.create(data).subscribe(
        _ => {
          this.service.alertFlashService.success(
            ["Tạo vật tư thành công"],
            this.optionsAlert
          );
          this.router.navigate(["/warehouse/sku"], { queryParams: { p: data?.groupCode } });
        },
        (error) => {
          this.showError(error, this.ref);
        }
      );
    }
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.f[controlName];
    return control.invalid && (control.dirty || control.touched);
  }
}