import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ActionCellSkuComponent } from "../components/action-cell-sku/action-cell-sku.component";
import { DetailCellSkuComponent } from "../components/detail-cell-sku/detail-cell-sku.component";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { BaseComponent } from "@app/modules/core/base/base.component";
import { ColumnConfig } from "@app/modules/core/table/_models/column.config";
import { ComponentService } from "@app/services/component.service";
import { InitDataService } from "@app/services/init-data.service";
import { SkuService } from "@app/services/sku.service";
import { ItemGroupModel } from "../models/item-group.model";
import { ActivatedRoute } from "@angular/router";
import { ITEM_GROUP } from "@app/modules/core/utils/constants";
import { InitDataModel } from "../models/init-data.model";
import { cleanObject } from "@app/modules/core/utils/helpers";
import { ExcelSheetComponent } from "@app/modules/core/reusable-components/excel-sheet/excel-sheet.component";
@Component({
  selector: "app-sku",
  templateUrl: "./sku.component.html",
  styleUrls: ["./sku.component.scss"],
})
export class SkuComponent extends BaseComponent {
  searchGroup: FormGroup;
  whseId: string;

  initDataWareHouse: InitDataModel;
  groupCodes: ItemGroupModel[] = ITEM_GROUP;

  columnsConfig: ColumnConfig[] = [
    {
      label: "Tên vật tư",
      dataKey: "name",
      sort: true,
      minWidth: 200,
      component: DetailCellSkuComponent,
    },
    { label: "Mã vật tư", dataKey: "code", sort: true, minWidth: 200 },
    {
      label: "Loại vật tư",
      dataKey: "groupCode",
      sort: false,
      minWidth: 200,
      predict: (item) =>
        `${
          this.groupCodes.find((v) => v.code === item?.groupCode)?.name
            ? this.groupCodes.find((v) => v.code === item?.groupCode)?.name
            : ""
        }`,
    },
    {
      label: "Thương hiệu / Nguồn gốc",
      dataKey: "manufacture",
      sort: false,
      minWidth: 200,
    },
    {
      label: "Khối lượng",
      dataKey: "netWeight",
      sort: false,
      minWidth: 200,
      predict: (item) =>
        `${item.netWeight} ${
          this.initDataWareHouse?.weightUnits.find(
            (v) => v.code === item?.weightUnit
          )?.value
            ? this.initDataWareHouse?.weightUnits.find(
                (v) => v.code === item?.weightUnit
              )?.value
            : ""
        }`,
    },
    {
      label: "Đơn vị",
      dataKey: "unit",
      sort: false,
      minWidth: 200,
      predict: (item) =>
        `${
          this.initDataWareHouse?.units.find((v) => v.code === item?.unit)
            ?.value && item?.groupCode !== "GL"
            ? this.initDataWareHouse?.units.find((v) => v.code === item?.unit)
                ?.value
            : ""
        }`,
    },
    {
      label: "Hành động",
      dataKey: "actionCell",
      width: 80,
      sort: false,
      minWidth: 150,
      component: ActionCellSkuComponent,
    },
  ];

  constructor(
    public skuService: SkuService,
    protected service: ComponentService,
    public ref: ChangeDetectorRef,
    private fb: FormBuilder,
    private initDataService: InitDataService,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) {
    super(service);
  }

  async ngOnInit() {
    if (!this.isModal) {
      this.service.subheaderService.updateBreadcrumbs(
        [
          {
            title: "Danh sách vật tư",
            linkPath: this.router.url,
          },
        ],
        "Trang chủ",
        [
          {
            name: "Import File",
            class: "btn btn-outline-primary mr-2",
            icon: "fa fa-upload icon-sm",
            isEvent: true,
            type: "upload",
          },
          {
            name: "Thêm vật tư",
            class: "btn btn-primary",
            icon: "ki ki-plus icon-sm",
            url: "/warehouse/sku/add",
          },
        ],
        "Danh sách vật tư"
      );
    } else {
      this.columnsConfig.splice(-1, 1);
    }
    this.subscription = this.service.subheaderService.eventEmit.subscribe(
      (v) => {
        if (v === "upload") {
          this.uploadFileModal();
        }
      }
    );
    this.searchGroup = this.fb.group({
      whseId: [],
      groupCode: [],
      codeLike: [""],
      name: [""],
    });
    this.initDataService
      .getInitDataWareHouse()
      .subscribe((v: InitDataModel) => {
        this.initDataWareHouse = v;
        this.ref.detectChanges();
      });
    this.initDataService.getWareHouse().subscribe((v: any) => {
      this.whseId = v[0].whseId;
      this.searchGroup.patchValue({
        whseId: v[0].whseId,
      });

      this.route.queryParams.subscribe((v) => {
        if (Object.keys(v).length !== 0) {
          this.searchGroup.patchValue({
            groupCode: v?.p,
          });
          this.skuService.patchState({
            filter: { whseId: this.searchGroupValue.whseId, groupCode: v?.p },
          });
        } else {
          this.skuService.patchState({
            filter: { whseId: this.searchGroupValue.whseId },
          });
        }
      });
    });
  }

  get searchGroupValue() {
    return this.searchGroup.value;
  }

  uploadFileModal() {
    const modalRef = this.modalService.open(ExcelSheetComponent, {
      size: "xl",
      centered: true,
      backdrop: "static",
    });
    modalRef.componentInstance.isForm = true;
    modalRef.componentInstance.baseService = this.skuService;
  }

  search() {
    this.skuService.patchState({
      filter: cleanObject(this.searchGroupValue),
    });
  }

  reset() {
    this.searchGroup.reset();
    this.router.navigate(["/warehouse/sku"]);
    this.searchGroup.patchValue({
      whseId: this.whseId,
    });
    this.skuService.patchState({
      filter: cleanObject(this.searchGroupValue),
    });
  }

  public sort(state) {
    this.skuService.fetch();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.skuService.subscriptions.forEach((sb) => sb.unsubscribe());
  }
}
