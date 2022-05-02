import { formatDate } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '@app/modules/core/base/base.component';
import { ConfirmModalComponent } from '@app/modules/core/confirm-modal/confirm-modal.component';
import { SelectionModalComponent } from '@app/modules/core/selection-modal/selection-modal.component';
import { PO_STATUS, PO_TYPES } from '@app/modules/core/utils/constants';
import { ComponentService } from '@app/services/component.service';
import { InitDataService } from '@app/services/init-data.service';
import { POService } from '@app/services/po.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SkuComponent } from '../../sku/list/sku.component';
import { InitDataModel } from '../../sku/models/init-data.model';
import { ListSupplierComponent } from '../../supplier/list-supplier/list-supplier.component';
import { POModel } from '../model/po.model';

@Component({
  selector: 'app-create-po',
  templateUrl: './create-po.component.html',
  styleUrls: ['./create-po.component.scss', './../../../core/table/basic-table/basic-table.component.scss']
})
export class CreatePOComponent extends BaseComponent implements OnDestroy {
  POData: POModel;
  formGroup: FormGroup;

  initDataWareHouse: InitDataModel;
  initDataHouseHold: any;

  PO_TYPES = PO_TYPES;
  PO_STATUS = PO_STATUS;

  totalMoneyPO: number = 0;
  constructor(
    protected service: ComponentService,
    public POService: POService,
    private modalService: NgbModal,
    public ref: ChangeDetectorRef,
    private fb: FormBuilder,
    private initDataService: InitDataService
  ) {
    super(service)
  }

  ngOnInit(): void {
    if (!this.isModal)
      this.service.subheaderService.updateBreadcrumbs(
        [
          {
            title: "Thêm phiếu nhập kho",
            linkPath: this.router.url,
          },
        ],
        "Trang chủ",
        [
          {
            name: "Thoát",
            class: "btn btn-outline-dark mr-3",
            url: "/warehouse/po",
          },          
          {
            name: this.routeParams.receiptKey ? 'Cập nhật' : "Lưu",
            class: "btn btn-primary",
            icon: "ki ki-plus icon-sm",
            isEvent: true,
            type: 'submit'
          },
        ],
        this.routeParams.receiptKey ? 'Chỉnh sửa phiếu' : "Tạo phiếu nhập kho"
      );

    this.subscription = this.service.subheaderService.eventEmit.subscribe(v => {
      if (v === 'submit') {
        this.onSubmit();
      }
    });

    this.formGroup = this.fb.group({
      id: [],
      whseId: ['BFMS'],
      storerKey: ['FARM'],
      code: [],
      receiptKey: [],
      supplierCode: [, Validators.required],
      supplierName: [, Validators.required],
      type: [, Validators.required],
      note: [],
      priceCurrencyType: [, Validators.required],
      expectedReceiptDate: [, Validators.required],
      items: this.fb.array([], Validators.required),
      status: [0]
    });

    this.initDataService.getInitDataWareHouse().subscribe((v: InitDataModel) => {
      this.initDataWareHouse = v;
      this.ref.detectChanges();
    });
    this.initDataService.getInitDataHouseHold().subscribe(v => {
      this.initDataHouseHold = v;
    });

    if (this.routeParams.receiptKey) {
      this.getDetail();
    }
  }

  get v() {
    return this.formGroup.value
  }

  getDetail() {
    this.POService.getDetailPO({
      whseId: 'BFMS',
      id: this.routeParams.id,
      receiptKey: this.routeParams.receiptKey
    }).subscribe((v: any) => {
      this.POData = v;
      if (Number(v.status) === 0 || Number(v.status) == 5) {
        this.service.subheaderService.setBreadcrumbsBtn([
          {
            name: "Hủy",
            class: "btn btn-outline-dark mr-3",
            url: "/warehouse/po",
          },
          {
            name: this.routeParams.receiptKey ? 'Cập nhật' : "Lưu",
            class: "btn btn-primary",
            icon: "ki ki-plus icon-sm",
            isEvent: true,
            type: 'submit'
          },
        ]);
      } else {
        this.service.subheaderService.setBreadcrumbsBtn([
          {
            name: "Hủy",
            class: "btn btn-outline-dark mr-3",
            url: "/warehouse/po",
          }
        ]);
        this.formGroup.disable();
      }
      this.formGroup.patchValue({
        ...v,
        type: Number(v.type),
        status: Number(v.status),
        expectedReceiptDate: v.expectedReceiptDate ? formatDate(v.expectedReceiptDate, 'yyyy-MM-dd', 'vi') : null
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
            receiptLineNumber: [item.receiptLineNumber],
            status: [Number(item.status)]
          }));
        }
        this.changeQuantity();
      }
      this.ref.detectChanges();
    })
  }

  selectSupplier() {
    const modalRef = this.modalService.open(SelectionModalComponent, { centered: true, size: 'xl', windowClass: 'modal-fullscreen' });
    modalRef.componentInstance.component = ListSupplierComponent;
    modalRef.componentInstance.isSelectedOnlyItem = true;

    modalRef.closed.subscribe(v => {
      if (v && v.length) {
        this.formGroup.patchValue({
          supplierName: v[0].name,
          supplierCode: v[0].code
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
      productName: [, Validators.compose([Validators.required])],
      code: [, Validators.compose([Validators.required])],
      qty: [, [Validators.required, Validators.min(0)]],
      unit: [, Validators.required],
      unitPrice: [, [Validators.required, Validators.min(0)]],
      conditionCode: [],
      status: [0]
    })
  }

  removeProduct(item: any, index: number) {
    // remove item if it has id
    if (item.value?.id) {
      const modalRef = this.modalService.open(ConfirmModalComponent, { centered: true });
      modalRef.componentInstance.info = {
        title: 'Xóa sản phẩm',
        content: 'Bạn muốn xóa sản phẩm của phiếu này?'
      }
      modalRef.closed.subscribe(v => {
        if (v) {
          this.POService.removePODetail({
            whseId: 'BFMS',
            receiptDetailIds: [item.value?.id]
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
    if (this.routeParams.receiptKey) {
      this.POService.updatePO({
        ...data,
        expectedReceiptDate: formatDate(data.expectedReceiptDate, 'yyyy-MM-dd HH:mm', 'vi'),
        type: data.type + ''
      }).subscribe(
        _ => {
          this.service.alertFlashService.success(
            ["Cập nhật phiếu thành công"],
            this.optionsAlert
          );
          this.router.navigate(["/warehouse/po"]);
        },
        (error) => {
          this.showError(error, this.ref);
        }
      );
    } else {
      this.POService.create({
        ...data,
        expectedReceiptDate: formatDate(data.expectedReceiptDate, 'yyyy-MM-dd HH:mm', 'vi'),
        type: data.type + ''
      }).subscribe(_ => {
        this.service.alertFlashService.success(
          ["Tạo phiếu thành công"],
          this.optionsAlert
        );
        this.router.navigate(["/warehouse/po"]);
      },
        (error) => {
          this.showError(error, this.ref);
        });
    }
  }
}
