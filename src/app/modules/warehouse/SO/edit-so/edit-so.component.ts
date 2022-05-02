import { SO_STATUS } from './../../../core/utils/constants';
import { formatDate } from "@angular/common";
import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BaseComponent } from "@app/modules/core/base/base.component";
import { SelectionModalComponent } from "@app/modules/core/selection-modal/selection-modal.component";
import { ITEM_GROUP, SO_TYPES } from "@app/modules/core/utils/constants";
import { ComponentService } from "@app/services/component.service";
import { SOService } from "@app/services/so.service";
import { UploadFileService } from "@app/services/upload-file.service";
import { InitDataService } from "@app/services/init-data.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CustomerComponent } from "../../customer/list/customer.component";
import { SkuComponent } from "../../sku/list/sku.component";
import { InitDataModel } from "../../sku/models/init-data.model";
import { ItemGroupModel } from "../../sku/models/item-group.model";
import { WarehouseModel } from "../../sku/models/warehouse.model";
import { SOModel } from "../models/so.model";
import { ConfirmModalComponent } from '@app/modules/core/confirm-modal/confirm-modal.component';

@Component({
  selector: "app-edit-so",
  templateUrl: "./edit-so.component.html",
  styleUrls: ["./edit-so.component.scss"],
})
export class EditSOComponent extends BaseComponent {
  itemGroups: ItemGroupModel[] = ITEM_GROUP;
  warehouses: WarehouseModel[] = [];
  soData: SOModel;
  formGroup: FormGroup;

  validTypeFiles = ["png", "jpg", "jpeg"];

  initDataWareHouse: InitDataModel;
  initDataHouseHold: any;

  totalMoneyPO: number = 0;

  companies = [];
  constructor(
    public soService: SOService,
    public initDataService: InitDataService,
    private fb: FormBuilder,
    protected service: ComponentService,
    protected uploadFileService: UploadFileService,
    public ref: ChangeDetectorRef,
    private modalService: NgbModal,
  ) {
    super(service);
  }

  SO_TYPES = SO_TYPES;
  SO_STATUS = SO_STATUS;

  async ngOnInit() {
    this.service.subheaderService.updateBreadcrumbs(
      [
        {
          title: "Danh sách phiếu xuất kho",
          linkPath: '/warehouse/so',
        },
        {
          title: this.routeParams.orderKey ? "Sửa phiếu xuất kho" : "Thêm phiếu xuất kho",
          linkPath: this.router.url
        },
      ],
      "Trang chủ",
      [
        {
          name: "Hủy",
          class: "btn btn-outline-secondary mr-2",
          url: "/warehouse/so",
        },
        {
          name: this.routeParams.orderKey ? 'Cập nhật' : "Lưu",
          class: "btn btn-primary",
          url: "#",
          isEvent: true,
          type: 'submit',
        }
      ],
      this.routeParams.orderKey ? 'Chỉnh sửa phiếu' : "Thêm phiếu xuất kho"
    );

    this.subscription = this.service.subheaderService.eventEmit.subscribe(v => {
      if (v === 'submit') {
        this.onSubmit();
      }
    })

    this.initDataService.getInitDataWareHouse().subscribe((v: InitDataModel) => this.initDataWareHouse = v);
    this.initDataService.getInitDataHouseHold().subscribe(v => {
      this.initDataHouseHold = v;
    });

    this.formGroup = this.fb.group({
      whseId: ['BFMS'],
      storerKey: ['FARM'],
      type: [, Validators.required],
      status: [4, Validators.required],
      note: [],
      id: [],
      code: [],
      priceCurrencyType: [, Validators.required],
      customerCode: [, Validators.required],
      customerName: [, Validators.required],
      requestedShipDate: [, Validators.required],
      items: this.fb.array([], Validators.required),
      orderKey: [],
    });
    if (this.routeParams.orderKey) {
      this.soService
        .getDetailSO({
          whseId: 'BFMS',
          id: this.routeParams.id,
          orderKey: this.routeParams.orderKey
        })
        .subscribe(async (v: any) => {
          this.soData = v;
          if (Number(v.status != 1) && Number(v.status != 2)  && Number(v.status != 95)) {
            this.service.subheaderService.setBreadcrumbsBtn([
              {
                name: "Hủy",
                class: "btn btn-outline-secondary mr-2",
                url: "/warehouse/so",
              },
              {
                name: this.routeParams.orderKey ? 'Cập nhật' : "Lưu",
                class: "btn btn-primary",
                url: "#",
                isEvent: true,
                type: 'submit',
              },
            ]);
          } else {
            this.service.subheaderService.setBreadcrumbsBtn([
              {
                name: "Hủy",
                class: "btn btn-outline-secondary mr-2",
                url: "/warehouse/so",
              }
            ]);
            this.formGroup.disable();
          }
          this.formGroup.patchValue({
            ...v,
            type: Number(v.type),
            status: Number(v.status),
            requestedShipDate: v.requestedShipDate ? formatDate(v.requestedShipDate, 'yyyy-MM-dd', 'vi') : null
          });
          if (v.items) {
            for (const item of v.items) {
              this.products().push(this.fb.group({
                id: [item.id],
                whseId: ['BFMS'],
                storerKey: ['FARM'],
                productName: [item.name, Validators.compose([Validators.required])],
                code: [item.code, Validators.compose([Validators.required])],
                qty: [Number(item.qty), [Validators.required, Validators.min(0)]],
                unit: [item.unit, Validators.required],
                unitPrice: [Number(item.unitPrice), [Validators.required, Validators.min(0)]],
                conditionCode: [item.conditionCode],
                orderLineNumber: [item.orderLineNumber],
                status: [item.status],
                orderKey: [v.orderKey]
              }));
            }
            this.changeQuantity();
          }
          this.ref.detectChanges();
        });
    }
  }

  get v() {
    return this.formGroup.value
  }

  selectCustomer() {
    const modalRef = this.modalService.open(SelectionModalComponent, { centered: true, size: 'xl', windowClass: 'modal-fullscreen' });
    modalRef.componentInstance.component = CustomerComponent;
    modalRef.componentInstance.isSelectedOnlyItem = true;

    modalRef.closed.subscribe(v => {
      if (v && v.length) {
        this.formGroup.patchValue({
          customerCode: v[0].code,
          customerName: v[0].name
        });
      }
    });
  }

  selectSKU(index: number) {
    const modalRef = this.modalService.open(SelectionModalComponent, { centered: true, size: 'xl', windowClass: 'modal-fullscreen' });
    modalRef.componentInstance.component = SkuComponent;
    modalRef.componentInstance.isSelectedOnlyItem = true;

    modalRef.closed.subscribe(v => {
      if (v && v.length) {
        this.controlProduct('productName', index).setValue(v[0].name);
        this.controlProduct('code', index).setValue(v[0].code);
        this.controlProduct('unit', index).setValue(v[0].unit);
      }
    });
  }

  changeQuantity() {
    this.totalMoneyPO = 0;
    for (const item of this.v.items) {
      this.totalMoneyPO += Number(item.unitPrice) * Number(item.qty)
    }
    this.totalMoneyPO = Math.round(this.totalMoneyPO / 1000) * 1000
  }

  products(): FormArray {
    return this.formGroup.get('items') as FormArray
  }

  newProduct() {
    return this.fb.group({
      id: [],
      whseId: ['BFMS'],
      storerKey: ['FARM'],
      unit: [, Validators.required],
      qty: [, [Validators.required, Validators.min(0)]],
      conditionCode: [],
      unitPrice: [, [Validators.required, Validators.min(0)]],
      productionDate: [],
      expirationDate: [],
      code: [, Validators.compose([Validators.required])],
      productName: [, Validators.compose([Validators.required])],
      status: [4, Validators.required]
    })
  }

  removeProduct(item: any, index: number) {
    if (item.value?.id) {
      const modalRef = this.modalService.open(ConfirmModalComponent, { centered: true });
      modalRef.componentInstance.info = {
        title: 'Xóa vật tư',
        content: 'Bạn muốn xóa vật tư của phiếu này?'
      }
      modalRef.closed.subscribe(v => {
        if (v) {
          this.soService.removeSODetail({
            whseId: 'BFMS',
            orderDetailIds: [item.value?.id]
          }).subscribe(_ => {
            this.service.alertFlashService.success(['Xóa item thành công'], this.optionsAlert);
            this.ref.detectChanges();
            this.products().removeAt(index);
          });
        }
      }, err => {
        this.showError(err, this.ref);
      })
    } else {
      this.products().removeAt(index);
    }
  }

  isControlProductValid(controlName: string, index: number): boolean {
    const control = ((this.formGroup.get('items') as FormArray).at(index) as FormGroup).controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlProductInValid(controlName: string, index: number): boolean {
    const control = ((this.formGroup.get('items') as FormArray).at(index) as FormGroup).controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlProduct(controlName: string, index: number) {
    return ((this.formGroup.get('items') as FormArray).at(index) as FormGroup).controls[controlName]
  }

  addProduct() {
    this.products().push(this.newProduct());
  }

  onSubmit() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.invalid) {
      return;
    }

    const data = this.formGroup.value;
    if (this.routeParams.orderKey) {
      this.soService.updateSO({
        ...data,
        requestedShipDate: formatDate(data.requestedShipDate, 'yyyy-MM-dd HH:mm', 'vi'),
        type: data.type + '',
        status: data.status + ''
      }).subscribe(
        _ => {
          this.service.alertFlashService.success(
            ["Cập nhật phiếu thành công"],
            this.optionsAlert
          );
          this.soService.fetch();
          this.router.navigate(["/warehouse/so"]);
        },
        (error) => {
          this.showError(error, this.ref);
        }
      );
    } else {
      this.soService.create({
        ...data,
        requestedShipDate: formatDate(data.requestedShipDate, 'yyyy-MM-dd HH:mm', 'vi'),
        type: data.type + '',
        status: data.status + ''
      }).subscribe(_ => {
        this.service.alertFlashService.success(
          ["Tạo phiếu thành công"],
          this.optionsAlert
        );
        this.soService.fetch();
        this.router.navigate(["/warehouse/so"]);
      },
        (error) => {
          this.showError(error, this.ref);
        });
    }
  }
}
