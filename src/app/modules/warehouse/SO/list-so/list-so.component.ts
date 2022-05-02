import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { BaseComponent } from "@app/modules/core/base/base.component";
import { ColumnConfig } from "@app/modules/core/table/_models/column.config";
import { SO_STATUS, SO_TYPES } from "@app/modules/core/utils/constants";
import { cleanObject } from "@app/modules/core/utils/helpers";
import { ComponentService } from "@app/services/component.service";
import { SOService } from "@app/services/so.service";
import { ActionCellSOComponent } from "../components/action-cell-so/action-cell-so.component";
import { DetailCellSOComponent } from "../components/detail-cell-so/detail-cell-so.component";
import { SOModel } from "../models/so.model";
import { formatDate } from "@angular/common";

@Component({
  selector: "app-list-so",
  templateUrl: "./list-so.component.html",
  styleUrls: ["./list-so.component.scss"],
})
export class ListSOComponent extends BaseComponent {
  SO_TYPES = SO_TYPES;
  SO_STATUS = SO_STATUS;

  isLoading$: any;
  searchGroup: FormGroup;
  listSO: SOModel[] = [];
  columnsConfig: ColumnConfig[] = [
    {
      label: "Mã xuất kho",
      dataKey: "code",
      sort: true,
      minWidth: 100,
      component: DetailCellSOComponent,
    },
    {
      label: "Tên khách hàng",
      dataKey: "customerName",
      sort: true,
      minWidth: 150,
    },
    { label: "Mã khách hàng", dataKey: "customerCode", sort: true, minWidth: 150 },
    {
      label: "Ngày xuất dự kiến", dataKey: "requestedShipDate", sort: true, minWidth: 100,
      predict: (item) => item?.requestedShipDate ? formatDate(item?.requestedShipDate, 'dd-MM-yyyy', 'vi') : ''
    },
    {
      label: "Phân loại", dataKey: "type", sort: true, minWidth: 150,
      predict: (item) => this.SO_TYPES.find(v => v?.code === Number(item?.type)).name
    },
    {
      label: "Trạng thái", dataKey: "status", sort: true, minWidth: 100,
      component: SOStatusCellComponent
    },
    {
      label: "Hành động",
      dataKey: "actionCell",
      minWidth: 100,
      sort: false,
      component: ActionCellSOComponent,
    },
  ];

  constructor(
    public soService: SOService,
    protected service: ComponentService,
    public ref: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
    super(service);
    this.isLoading$ = this.soService.isLoading$;
  }

  ngOnInit() {
    if (!this.isModal)
      this.service.subheaderService.updateBreadcrumbs(
        [
          {
            title: "Danh sách phiếu xuất kho",
            linkPath: this.router.url,
            linkText: "Danh sách phiếu xuất kho",
          },
        ],
        "Trang chủ",
        [
          {
            name: 'Thêm phiếu xuất kho',
            class: 'btn btn-primary',
            icon: 'ki ki-plus icon-sm',
            url: '/warehouse/so/add'
          }
        ],
        'Danh sách phiếu xuất kho'
      );

    this.soService.patchState({
      filter: { whseId: 'BFMS' },
    });
    this.searchGroup = this.fb.group({
      whseId: ['BFMS'],
      customerCode: [],
      codeLike: [],
      type: [], 
      status: []
    });
  }

  get searchGroupValue() {
    return this.searchGroup.value;
  }

  search() {
    const data = cleanObject(this.searchGroupValue)
    this.soService.patchState({
      filter: data,
    });
  }

  reset() {
    this.searchGroup.reset({
      whseId: 'BFMS'
    });
    this.soService.patchState({
      filter: cleanObject(this.searchGroupValue)
    });
  }

  public sort(state) {
    this.soService.fetch();
  }

  ngOnDestroy(): void {
    this.soService.subscriptions.forEach((sb) => sb.unsubscribe());
  }
}

@Component({
  template: `
      <p [attr.class]="className">
        {{ status?.name }}
      </p>
  `, styleUrls: ["./list-so.component.scss"],
})
export class SOStatusCellComponent implements OnInit {
  @Input() prop;
  className: string;
  status: any;

  SO_STATUS = SO_STATUS;

  ngOnInit(): void {
    this.status = this.SO_STATUS.find(v => v?.code === Number(this.prop?.status));
    this.className = `status ${this.status?.style}`;
  }
}
