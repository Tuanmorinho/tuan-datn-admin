import { EditRiceSeedsComponent } from './components/edit-rice-seeds/edit-rice-seeds.component';
import { EditMachinesVehiclesComponent } from './components/edit-machines-vehicles/edit-machines-vehicles.component';
import { EditFertilizerPesticideComponent } from './components/edit-fertilizer-pesticide/edit-fertilizer-pesticide.component';
import { finalize } from 'rxjs/operators';
import { SKUModel } from '../models/sku.model';
import { SkuService } from '@app/services/sku.service';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '@app/modules/core/base/base.component';
import { ComponentService } from '@app/services/component.service';
import { InitDataService } from '@app/services/init-data.service';
import { UploadFileService } from '@app/services/upload-file.service';
import { ItemGroupModel } from '../models/item-group.model';
import { InitDataModel } from '../models/init-data.model';
import { WarehouseModel } from '../models/warehouse.model';
import { ITEM_GROUP } from '@app/modules/core/utils/constants';

@Component({
  selector: 'app-edit-sku',
  templateUrl: './edit-sku.component.html',
  styleUrls: ['./edit-sku.component.scss']
})
export class EditSkuComponent extends BaseComponent {
  @ViewChild(EditFertilizerPesticideComponent) fertilizerPeticideForm: EditFertilizerPesticideComponent
  @ViewChild(EditMachinesVehiclesComponent) machinesVehiclesForm: EditMachinesVehiclesComponent
  @ViewChild(EditRiceSeedsComponent) riceSeedsForm: EditRiceSeedsComponent

  groupCodes: ItemGroupModel[] = ITEM_GROUP;
  whseId: string;

  initDataWareHouse: InitDataModel

  formGroup: FormGroup;
  validTypeFiles = ["png", "jpg", "jpeg"];

  constructor(
    public skuService: SkuService,
    private fb: FormBuilder,
    protected service: ComponentService,
    protected uploadFileService: UploadFileService,
    public ref: ChangeDetectorRef,
    private initDataService: InitDataService,
  ) {
    super(service);
  }

  async ngOnInit() {
    this.service.subheaderService.updateSubBreadcrumbs(
      [
        {
          title: "Danh sách vật tư",
          linkPath: '/warehouse/sku',
        },
        {
          title: this.routeParams.id
            ? 'Chỉnh sửa vật tư' : "Thêm vật tư",
          linkPath: this.router.url
        },
      ],
      'Trang chủ',
      [
        {
          name: "Hủy",
          class: "btn btn-outline-secondary mr-2",
          url: "/warehouse/sku",
        },
        {
          name: this.routeParams.id ? "Cập nhật " : 'Lưu',
          class: "btn btn-primary",
          url: "#",
          isEvent: true,
          type: 'submit',
        },
      ],
      this.routeParams.id ? 'Chỉnh sửa vật tư' : "Thêm vật tư"
    );

    this.subscription = this.service.subheaderService.eventEmit.subscribe(v => {
      if (v === 'submit') {
        this.onSubmit();
      }
    })

    this.formGroup = this.fb.group({
      id: [],
      code: [],
      whseId: [],
      storerKey: [],
      groupCode: [, Validators.required],
      name: [, Validators.required],
      netWeight: [, Validators.required],
      grossWeight: [],
      weightUnit: [, Validators.required],
      unit: [, [Validators.required]],
      manufacture: [, Validators.required],
      images: [], // cho việc lưu DB
      photos: [], // cho việc hiển thị

      susr04: [],
      susr05: [],
      susr06: [],
      susr07: [],
      susr08: [, Validators.required],
      susr09: [],

      // files: [, Validators.required]
    });

    this.initDataService.getInitDataWareHouse().subscribe((v: InitDataModel) => {
      this.initDataWareHouse = v
    })
    this.initDataService.getWareHouse().pipe(
      finalize(() => {
        this.getSkuForEdit()
      })
    ).subscribe((v: WarehouseModel) => {
      this.whseId = v[0].whseId
      this.formGroup.patchValue({
        whseId: v[0].whseId,
        storerKey: v[0].storerKey
      })
    })


  }

  getSkuForEdit() {
    const code = this.routeParams["id"];
    if (code) {
      this.skuService.getSkuItemByCode(code, this.whseId).subscribe(async (res: SKUModel) => {
        this.formGroup.patchValue({
          ...res,
        });
        if (res?.images) {
          let photos = [];
          this.skuService.isLoading = true;
          try {
            for (const item of res.images) {
              const bucket = item?.bucket ? item?.bucket : '';
              const fileName = item?.fileKey ? item?.fileKey : '';
              this.uploadFileService.downloadFile(bucket, fileName).subscribe(x => {
                if (x) {
                  photos.push(x);
                  this.formGroup.patchValue({
                    photos: photos
                  });
                }
              });
              this.ref.detectChanges();
            }
          } catch (error) {
            this.skuService.isLoading = false;
          }
        }
        this.ref.detectChanges();
      });
    }
  }

  ngAfterViewChecked() {
    this.ref.detectChanges();
  }

  get f() {
    return this.formGroup.controls;
  }

  get v() {
    return this.formGroup.value;
  }

  async onSubmit() {
    if (this.v.groupCode === 'PB' || this.v.groupCode === 'TBVTV') {
      this.fertilizerPeticideForm.onSubmit();
    }
    if (this.v.groupCode === 'MM' || this.v.groupCode === 'X') {
      this.machinesVehiclesForm.onSubmit();
    }
    if (this.v.groupCode === 'GL') {
      this.riceSeedsForm.onSubmit();
    }
  }
}
