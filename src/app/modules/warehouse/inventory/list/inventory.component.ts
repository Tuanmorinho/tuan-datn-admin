import { CustomerService } from "./../../../../services/customer.service";
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { BaseComponent } from "@app/modules/core/base/base.component";
import { ColumnConfig } from "@app/modules/core/table/_models/column.config";
import { ComponentService } from "@app/services/component.service";
import { cleanObject } from "@app/modules/core/utils/helpers";
import { InventoryService } from "@app/services/inventory.service";
import { InitDataService } from "@app/services/init-data.service";
import { ITEM_GROUP } from "@app/modules/core/utils/constants";
import { ItemGroupModel } from "../../sku/models/item-group.model";
import { InitDataModel } from "../../sku/models/init-data.model";

@Component({
  selector: "app-inventory",
  templateUrl: "./inventory.component.html",
  styleUrls: ["./inventory.component.scss"],
})
export class InventoryComponent extends BaseComponent implements OnDestroy {
  searchGroup: FormGroup;
  groupCodes: ItemGroupModel[] = ITEM_GROUP;
  initDataWareHouse: InitDataModel;
  columnsConfig: ColumnConfig[] = [
    { label: "Mã vật tư", dataKey: "code", sort: true, minWidth: 150 },
    { label: "Tên vật tư", dataKey: "name", sort: true, minWidth: 150 },
    { label: "Loại vật tư", dataKey: "groupCode", sort: false, minWidth: 120,
    predict: (item) =>
    `${
      this.groupCodes.find((v) => v.code === item?.groupCode)?.name
        ? this.groupCodes.find((v) => v.code === item?.groupCode)?.name
        : ""
    }`, },
    {
      label: "Số lượng dự định nhập",
      dataKey: "qtyAllocated",
      sort: true,
      minWidth: 120,
    },
    {
      label: "Số lượng hiện có sẵn",
      dataKey: "qtyAvailable",
      sort: true,
      minWidth: 150,
    },
    {
      label: "Số lượng dự định xuất",
      dataKey: "qtyPicked",
      sort: true,
      minWidth: 150,
    },
    { label: "Số lượng tổng", dataKey: "qty", sort: true, minWidth: 150 },
    {
      label: "Đơn vị",
      dataKey: "unit",
      sort: false,
      minWidth: 120,
      predict: (item) =>
        `${
          this.initDataWareHouse?.units.find((v) => v.code === item?.unit)
            ?.value && item?.groupCode !== "GL"
            ? this.initDataWareHouse?.units.find((v) => v.code === item?.unit)
                ?.value
            : ""
        }`,
    },
  ];

  constructor(
    public inventoryService: InventoryService,
    private initDataService: InitDataService,
    protected service: ComponentService,
    public ref: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
    super(service);
  }

  async ngOnInit() {
    this.service.subheaderService.updateBreadcrumbs(
      [
        {
          title: "Danh sách tồn kho",
          linkPath: this.router.url,
        },
      ],
      "Trang chủ",
      [],
      "Danh sách tồn kho"
    );
    this.initDataService
      .getInitDataWareHouse()
      .subscribe((v: InitDataModel) => {
        this.initDataWareHouse = v;
        this.ref.detectChanges();
      });
    this.inventoryService.patchState({
      filter: { whseId: "BFMS" },
    });
    this.searchGroup = this.fb.group({
      whseId: ["BFMS"],
      codeLike: [""],
      groupCode: [],
      name: [""],
    });
  }

  get searchGroupValue() {
    return this.searchGroup.value;
  }

  search() {
    const data = cleanObject(this.searchGroupValue);
    this.inventoryService.patchState({
      filter: data,
    });
  }

  reset() {
    this.searchGroup.reset({
      whseId: "BFMS",
      codeLike: "",
      name: "",
      groupCode: "",
    });

    this.inventoryService.patchState({
      filter: this.searchGroup.value,
    });
  }

  public sort(state) {
    this.inventoryService.fetch();
  }

  ngOnDestroy(): void {
    this.inventoryService.subscriptions.forEach((sb) => sb.unsubscribe());
  }
}
