import { SkuService } from '@app/services/sku.service';
import { InitDataService } from './../../../../services/init-data.service';
import { ComponentService } from './../../../../services/component.service';
import { BaseComponent } from './../../../core/base/base.component';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SKUModel } from '../models/sku.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { WarehouseModel } from '../models/warehouse.model';
import { UploadFileService } from '@app/services/upload-file.service';
import { ConfirmModalComponent } from '@app/modules/core/confirm-modal/confirm-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InitDataModel } from '../models/init-data.model';

@Component({
  selector: 'app-detail-sku',
  templateUrl: './detail-sku.component.html',
  styleUrls: ['./detail-sku.component.scss']
})
export class DetailSkuComponent extends BaseComponent {

  skuItems: SKUModel;
  initDataWareHouse: InitDataModel;

  activeBtnPr: string = 'btn-product-infor-active';
  activeBtnMn: string = '';
  activePrForm: boolean = true;
  activeMnForm: boolean = false;

  unitAndType: any;

  formGroup: FormGroup;
  validTypeFiles = ["png", "jpg", "jpeg"];

  constructor(
    protected service: ComponentService,
    private initDataService: InitDataService,
    private uploadFileService: UploadFileService,
    public skuService: SkuService,
    private fb: FormBuilder,
    public ref: ChangeDetectorRef,
    private modalService: NgbModal
  ) {
    super(service)
  }

  ngOnInit(): void {
    this.service.subheaderService.updateSubBreadcrumbs(
      [
        {
          title: "Danh sách vật tư",
          linkPath: '/warehouse/sku',
        },
        {
          title: "Chi tiết vật tư",
          linkPath: this.router.url
        },
      ],
      'Trang chủ',
      [
        {
          name: "Thoát",
          class: "btn btn-outline-secondary mr-2",
          url: "/warehouse/sku"
        },
        {
          name: "Xóa",
          class: "btn btn-outline-danger mr-2",
          url: "#",
          isEvent: true,
          type: 'delete',
        },
        {
          name: "Chỉnh sửa",
          class: "btn btn-primary",
          url: `/warehouse/sku/edit/${this.routeParams["id"]}`,
        },
      ],
      "Chi tiết vật tư"
    );

    this.subscription = this.service.subheaderService.eventEmit.subscribe(v => {
      if (v === 'delete') {
        this.delete();
      }
    })

    this.formGroup = this.fb.group({
      photos: []
    })

    this.initDataService.getInitDataWareHouse().subscribe((v: InitDataModel) => {
      this.initDataWareHouse = v;
      this.ref.detectChanges();
    })

    this.initDataService.getWareHouse().subscribe((v: WarehouseModel) => {
      const code = this.routeParams["id"];
      this.skuService.getSkuItemByCode(code, v[0].whseId).subscribe((res: SKUModel) => {
        this.skuItems = res;
        this.unitAndType = {
          unit: this.initDataWareHouse?.units.find(v => v.code === res?.unit)?.value ? this.initDataWareHouse?.units.find(v => v.code === res?.unit)?.value : '',
          weiUnit: this.initDataWareHouse?.weightUnits.find(v => v.code === res?.weightUnit)?.value ? this.initDataWareHouse?.weightUnits.find(v => v.code === res?.weightUnit)?.value : '',
          watUnit: this.initDataWareHouse?.wattageUnits.find(v => v.code === res?.susr07)?.value ? this.initDataWareHouse?.wattageUnits.find(v => v.code === res?.susr07)?.value : '',
          volUnit: this.initDataWareHouse?.volumeUnits.find(v => v.code === res?.susr09)?.value ? this.initDataWareHouse?.volumeUnits.find(v => v.code === res?.susr09)?.value : '',
          typeAgri: this.initDataWareHouse?.agriculturalMachineTypes.find(v => v.code === res?.susr08)?.value ? this.initDataWareHouse?.agriculturalMachineTypes.find(v => v.code === res?.susr08)?.value : '',
          typeFert: this.initDataWareHouse?.fertilizerTypes.find(v => v.code === res?.susr08)?.value ? this.initDataWareHouse?.fertilizerTypes.find(v => v.code === res?.susr08)?.value : '',
          typeFuel: this.initDataWareHouse?.fuelTypes.find(v => v.code === res?.susr04)?.value ? this.initDataWareHouse?.fuelTypes.find(v => v.code === res?.susr04)?.value : '',
        }
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
      })
    })
  }

  delete() {
    const modalRef = this.modalService.open(ConfirmModalComponent, { centered: true });
    modalRef.componentInstance.info = {
      title: 'Xóa vật tư',
      content: 'Bạn có muốn xóa vật tư' 
    };
    modalRef.closed.subscribe(v => {
      if (v) {
        this.skuService.deleteSkuItem({
          id: this.skuItems.id,
          code: this.skuItems.code,
          whseId: 'BFMS',
          storerKey: 'FARM'
        }).subscribe(v => {
          this.service.alertFlashService.success(['Xóa thành công'], this.optionsAlert);
          this.router.navigate(["/warehouse/sku"], { queryParams: { p: this.skuItems?.groupCode } });
          this.skuService.fetch();
        });
      }
    });
  }


  toggleProductInf() {
    this.activeBtnPr = 'btn-product-infor-active';
    this.activeBtnMn = '';
    this.activePrForm = true;
    this.activeMnForm = false;
  }

  toggleManual() {
    this.activeBtnPr = '';
    this.activeBtnMn = 'btn-manual-active';
    this.activePrForm = false;
    this.activeMnForm = true;
  }

}
