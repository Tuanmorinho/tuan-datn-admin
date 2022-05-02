import { formatDate } from "@angular/common";
import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { BaseComponent } from "@app/modules/core/base/base.component";
import { ColumnConfig } from "@app/modules/core/table/_models/column.config";
import { PO_STATUS, PO_TYPES } from "@app/modules/core/utils/constants";
import { ComponentService } from "@app/services/component.service";
import { POService } from "@app/services/po.service";
import { ActionCellPOComponent } from "../components/action-cell/action-cell.component";
import { DetailCellPOComponent } from "../components/detail-cell/detail-cell.component";
import { cleanObject } from '../../../../modules/core/utils/helpers';

@Component({
  selector: "app-list-po",
  templateUrl: "./list-po.component.html",
  styleUrls: ["./list-po.component.scss"],
})
export class ListPOComponent extends BaseComponent implements OnDestroy {
  searchGroup: FormGroup;
  enableList = [
    { value: true, name: "Đang hoạt động" },
    { value: false, name: "Dừng hoạt động" },
  ];
  columnsConfig: ColumnConfig[] = [
    { label: "Mã nhập kho", dataKey: "code", sort: true, minWidth: 150, component: DetailCellPOComponent },
    { label: "Phân loại", dataKey: "type", sort: true, minWidth: 120, predict: (item) => PO_TYPES.find(v => v.code == item.type)?.name },
    {
      label: "Tên nhà cung cấp",
      dataKey: "supplierName",
      sort: true,
      minWidth: 150,
    },
    {
      label: "Mã nhà cung cấp",
      dataKey: "supplierCode",
      sort: true,
      minWidth: 150,
    },
    
    {
      label: "Ngày nhận dự kiến",
      dataKey: "expectedReceiptDate",
      sort: true,
      minWidth: 220,
      predict: (item) => item?.expectedReceiptDate ? formatDate(item?.expectedReceiptDate, 'dd-MM-yyy HH:mm', 'vi') : ''
    },
    { label: "Trạng thái", dataKey: "status", sort: true, minWidth: 120, component: POStatusCellComponent },
    {
      label: "Hành động",
      dataKey: "actionCell",
      minWidth: 120,
      sort: false,
      component: ActionCellPOComponent,
    },
  ];

  PO_TYPES = PO_TYPES;
  PO_STATUS = PO_STATUS;

  constructor(
    protected service: ComponentService,
    public POService: POService,
    private fb: FormBuilder
  ) {
    super(service);
  }

  ngOnInit(): void {
    if (!this.isModal)
      this.service.subheaderService.updateBreadcrumbs(
        [
          {
            title: "Quản lý phiếu nhập kho",
            linkPath: this.router.url,
          },
        ],
        "Trang chủ",
        [
          {
            name: "Tạo phiếu nhập kho",
            class: "btn btn-primary",
            url: "/warehouse/po/add",
            icon: "ki ki-plus icon-sm",
          },
        ],
        "Quản lý phiếu nhập kho"
      );

    this.searchGroup = this.fb.group({
      whseId: ["BFMS"],
      supplierCode: [],
      codeLike: [],
      type: [],
      status: []
    });

    this.POService.patchState({
      filter: { whseId: "BFMS" },
    });
  }

  reset() {
    this.searchGroup.reset({
      whseId: "BFMS",
      supplierCode: null,
      codeLike: null,
      type: null,
      status: null
    });
    this.POService.patchState({
      filter: cleanObject(this.searchGroup.value),
    });
  }

  public sort(state) {
    this.POService.fetch();
  }

  get searchGroupValue() {
    return this.searchGroup.value;
  }

  search() {
    this.POService.patchState({
      filter: cleanObject(this.searchGroup.value),
    });
  }
}

@Component({
  template: `
      <p [attr.class]="className">
        {{ status?.name }}
      </p>
  `, styleUrls: ["./list-po.component.scss"],
})
export class POStatusCellComponent implements OnInit {
  @Input() prop;
  className: string;
  status: any;

  PO_STATUS = PO_STATUS;

  ngOnInit(): void {
    this.status = this.PO_STATUS.find(v => v?.code === Number(this.prop?.status));
    this.className = `status ${this.status?.style}`;
  }
}
