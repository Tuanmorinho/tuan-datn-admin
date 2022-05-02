import { formatDate } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { BaseComponent } from "@app/modules/core/base/base.component";
import { ConfirmModalComponent } from "@app/modules/core/confirm-modal/confirm-modal.component";
import { ColumnConfig } from "@app/modules/core/table/_models/column.config";
import { PO_STATUS, PO_TYPES } from "@app/modules/core/utils/constants";
import { sort_by } from "@app/modules/core/utils/helpers";
import { ComponentService } from "@app/services/component.service";
import { ItemPOService } from "@app/services/po-item.service";
import { POService } from "@app/services/po.service";
import { ITableState } from "@app/_metronic/shared/crud-table";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ItemPOModel, POModel } from "../model/po.model";

@Component({
  selector: "app-detail-po",
  templateUrl: "./detail-po.component.html",
  styleUrls: ["./detail-po.component.scss"],
})
export class DetailPOComponent extends BaseComponent {
  searchGroup: FormGroup;
  poModel: POModel;
  columnsConfig: ColumnConfig[] = [
    {
      label: 'Tên sản phẩm',
      dataKey: 'name',
      sort: true
    },
    {
      label: 'Mã sản phẩm',
      dataKey: 'code',
      sort: true
    },
    {
      label: 'Trạng thái',
      dataKey: 'status',
      sort: true,
      predict: (item: POModel) => PO_STATUS.find(v => v.code === Number(item.status))?.name
    },
    {
      label: 'Đơn vị',
      dataKey: 'unit',
      sort: true
    },
    {
      label: 'Giá đơn vị',
      dataKey: 'unitPrice',
      sort: true
    },
    {
      label: 'Số lượng',
      dataKey: 'qty',
      sort: true,
      predict: (item) => Number(item.qty)
    },
  ];
  itemsFilter = [];
  PO_STATUS = PO_STATUS;

  totalMoneyPO: number = 0;
  loading$: any;
  constructor(
    public itemPOService: ItemPOService,
    private POService: POService,
    protected service: ComponentService,
    public ref: ChangeDetectorRef,
    private fb: FormBuilder,
    private modalService: NgbModal
  ) {
    super(service);
    this.loading$ = POService.isLoading$;
  }

  ngOnInit(): void {
    if (!this.isModal)
      this.service.subheaderService.updateBreadcrumbs(
        [
          {
            title: "Danh sách phiếu nhập kho",
            linkPath: '/warehouse/po',
          },
          {
            title: "Quản lý phiếu nhập kho",
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
        ],
        "Quản lý phiếu nhập kho"
      );
    this.searchGroup = this.fb.group({
      name: [],
      status: []
    });
    if (this.routeParams.receiptKey) {
      this.getDetail();
    }
  }

  getDetail() {
    this.POService.getDetailPO({
      whseId: 'BFMS',
      id: this.routeParams.id,
      receiptKey: this.routeParams.receiptKey
    }).subscribe((v: POModel) => {
      //update breacurmb
      this.service.subheaderService.setDescription('Chi tiết phiếu:  '  + v.code);
      if (Number(v.status) === 0 || Number(v.status) === 5) {
        this.service.subheaderService.setBreadcrumbsBtn([
          {
            name: "Thoát",
            class: "btn btn-outline-dark mr-3",
            url: "/warehouse/po",
          },
          {
            name: "Hủy",
            class: "btn btn-outline-danger mr-3",
            isEvent: true,
            type: 'cancel'
          },
          {
            name: "Chỉnh sửa",
            class: "btn btn-primary",
            url: '/warehouse/po/edit/' + this.routeParams.id + '/' + this.routeParams.receiptKey
          },
        ]);
        this.subscription = this.service.subheaderService.eventEmit.subscribe(v1 => {
          if (v1 === 'cancel') {
            this.delete(v);
          }
        })
      }

      v.expectedReceiptDate = v.expectedReceiptDate ? formatDate(v.expectedReceiptDate, 'yyyy-MM-dd', 'vi') : null;
      v.createdDate = v.createdDate ? formatDate(v.createdDate, 'yyyy-MM-dd', 'vi') : null
      v.status = PO_STATUS.find(v1 => v1.code == Number(v.status))?.name;
      v.type = PO_TYPES.find(v1 => v1.code == Number(v.type))?.name;
      this.poModel = v;

      this.itemPOService.items = this.poModel.items;
      this.itemPOService.paginator.total = this.poModel.items.length;
      this.itemsFilter = this.poModel.items;

      for (const item of this.poModel.items) {
        this.totalMoneyPO += Number(item.unitPrice) * Number(item.qty)
      }
      this.totalMoneyPO = Math.round(this.totalMoneyPO / 1000) * 1000
      this.ref.detectChanges();
    })
  }

  delete(prop: POModel) {
    const modalRef = this.modalService.open(ConfirmModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.info = {
      title: "Hủy phiếu nhập kho",
      content: "Bạn có muốn hủy phiếu nhập kho",
    };
    modalRef.closed.subscribe((v) => {
      if (v) {
        this.POService.cancelPO({
          receiptIds: [
            prop.id
          ]
        }).subscribe(v => {
          this.service.alertFlashService.success(['Hủy thành công'], this.optionsAlert);
          this.router.navigate(['/warehouse/po']);
        });
      }
    });
  }

  get searchGroupValue() {
    return this.searchGroup.value;
  }

  search() {
    let usersFilterByKeyword = this.itemsFilter
    if (this.searchGroupValue.name) {
      usersFilterByKeyword = this.itemsFilter.filter((v: ItemPOModel) => {
        return (
          (v.name
            ? v.name.includes(this.searchGroupValue.name)
            : false) ||
          (v.code ? v.code.includes(this.searchGroupValue.name) : false)
        );
      });
    }
    if (this.searchGroupValue.status) {
      usersFilterByKeyword = usersFilterByKeyword.filter((r) => {
        return r?.status
          ? Number(r.status) === this.searchGroupValue.status
          : false;
      });
    }
    this.itemPOService.items = usersFilterByKeyword;
  }

  reset() {
    this.searchGroup.reset();
    this.itemPOService.items = this.itemsFilter;
  }

  sort(state: ITableState) {
    if (state.sorting) {
      this.itemPOService.items = this.itemsFilter.sort(sort_by(state.sorting.column, state.sorting.direction === 'asc' ? true : false, (a) => a
      )).slice(0, this.itemPOService?.paginator.pageSize);
    }
    if (state.paginator) {
      this.itemPOService.items = this.itemsFilter.slice((state.paginator.page - 1) * state.paginator.pageSize, state.paginator.page * state.paginator.pageSize);
    }
  }
}
