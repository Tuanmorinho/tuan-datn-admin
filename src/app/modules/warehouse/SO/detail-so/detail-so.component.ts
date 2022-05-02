import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { BaseComponent } from "@app/modules/core/base/base.component";
import { ConfirmModalComponent } from "@app/modules/core/confirm-modal/confirm-modal.component";
import { ColumnConfig } from "@app/modules/core/table/_models/column.config";
import { SO_STATUS, SO_TYPES } from "@app/modules/core/utils/constants";
import { ComponentService } from "@app/services/component.service";
import { ItemSOService } from "@app/services/so-items.service";
import { SOService } from "@app/services/so.service";
import { UploadFileService } from "@app/services/upload-file.service";
import { ITableState } from "@app/_metronic/shared/crud-table";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SOModel } from "../models/so.model";
import { sort_by } from "@app/modules/core/utils/helpers";
import { formatDate } from "@angular/common";
import { SOStatusCellComponent } from "../list-so/list-so.component";
import { finalize } from "rxjs/operators";

@Component({
  selector: "app-detail-so",
  templateUrl: "./detail-so.component.html",
  styleUrls: ["./detail-so.component.scss"],
})
export class DetailSOComponent extends BaseComponent implements OnInit {
  searchGroup: FormGroup;
  soData: SOModel;
  totalMoneySO = 0;
  styleStatus: string;
  columnsConfig: ColumnConfig[] = [
    {
      label: "Tên vật tư",
      dataKey: "name",
      sort: true,
    },
    {
      label: "Mã vật tư",
      dataKey: "code",
      sort: true,
    },
    {
      label: "Trạng thái",
      dataKey: "status",
      sort: true,
      component: SOStatusCellComponent
    },
    {
      label: "Đơn vị",
      dataKey: "unit",
      sort: true,
    },
    {
      label: "Giá đơn vị",
      dataKey: "unitPrice",
      sort: true,
    },
    {
      label: "Số lượng",
      dataKey: "qty",
      sort: true,
      predict: (item) => Number(item.qty),
    },
  ];
  itemsFilter = [];
  SO_STATUS = SO_STATUS;

  constructor(
    public itemSOService: ItemSOService,
    public soService: SOService,
    protected service: ComponentService,
    private modalService: NgbModal,
    protected uploadFileService: UploadFileService,
    public ref: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
    super(service);
  }

  ngOnInit(): void {
    this.service.subheaderService.updateBreadcrumbs(
      [
        {
          title: "Danh sách phiếu xuất kho",
          linkPath: "/warehouse/so",
        },
        {
          title: "Thông tin phiếu xuất kho",
          linkPath: this.router.url,
        },
      ],
      "Trang chủ",
      [],
      "Chi tiết phiếu xuất kho"
    );

    this.searchGroup = this.fb.group({
      name: [],
      status: [],
    });

    // get detail
    this.soService
      .getDetailSO({
        whseId: "BFMS",
        id: this.routeParams.id,
        orderKey: this.routeParams.orderKey,
      }).pipe(
        finalize(() => this.styleStatus = `status ${this.SO_STATUS.find(v2 => v2?.name === this.soData?.status).style}`)
      )
      .subscribe((v: any) => {
        this.service.subheaderService.setDescription(
          "Chi tiết phiếu:  " + v.code
        );
        if (
          Number(v.status) !== 1 &&
          Number(v.status) !== 2 &&
          Number(v.status) !== 95
        ) {
          this.service.subheaderService.setBreadcrumbsBtn([
            {
              name: "Thoát",
              class: "btn btn-outline-dark mr-3",
              url: "/warehouse/so",
            },
            {
              name: "Hủy",
              class: "btn btn-outline-danger mr-3",
              isEvent: true,
              type: "cancel",
            },
            {
              name: "Chỉnh sửa",
              class: "btn btn-primary",
              url:
                "/warehouse/so/edit/" +
                this.routeParams.id +
                "/" +
                this.routeParams.orderKey,
            },
          ]);
          this.subscription = this.service.subheaderService.eventEmit.subscribe(
            (v1) => {
              if (v1 === "cancel") {
                this.delete(v);
              }
            }
          );
        } else {
          this.service.subheaderService.setBreadcrumbsBtn([
            {
              name: "Thoát",
              class: "btn btn-outline-dark mr-3",
              url: "/warehouse/so",
            },
          ]);
        }

        v.requestedShipDate = v.requestedShipDate
          ? formatDate(v.requestedShipDate, "yyyy-MM-dd", "vi")
          : null;
        v.actualShipDate = v.actualShipDate
          ? formatDate(v.actualShipDate, "yyyy-MM-dd", "vi")
          : null;
        v.createdDate = v.createdDate
          ? formatDate(v.createdDate, "yyyy-MM-dd", "vi")
          : null;
        v.status = SO_STATUS.find((v1) => v1.code == Number(v.status))?.name;
        v.type = SO_TYPES.find((v1) => v1.code == Number(v.type))?.name;
        this.soData = v;
        

        this.itemSOService.items = this.soData.items;
        this.itemSOService.paginator.total = this.soData.items.length;
        this.itemsFilter = this.soData.items;

        for (const item of this.soData.items) {
          this.totalMoneySO += Number(item.unitPrice) * Number(item.qty);
        }
        this.totalMoneySO = Math.round(this.totalMoneySO / 1000) * 1000;
        this.ref.detectChanges();
      });
  }

  delete(prop: SOModel) {
    const modalRef = this.modalService.open(ConfirmModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.info = {
      title: "Hủy phiếu xuất kho",
      content: "Bạn có muốn hủy phiếu xuất kho",
    };
    modalRef.closed.subscribe((v) => {
      if (v) {
        this.soService
          .cancelSO({
            orderIds: [prop.id],
          })
          .subscribe((v) => {
            this.service.alertFlashService.success(
              ["Hủy thành công"],
              this.optionsAlert
            );
            this.router.navigate(["/warehouse/so"]);
          }, err => this.showError(err, this.ref));
      }
    });
  }

  get f() {
    return this.formGroup.controls;
  }

  get v() {
    return this.formGroup.value;
  }

  get searchGroupValue() {
    return this.searchGroup.value;
  }

  search() {
    let usersFilterByKeyword = this.itemsFilter;
    if (this.searchGroupValue.name) {
      usersFilterByKeyword = this.itemsFilter.filter((v: any) => {
        return (
          (v.name ? v.name.includes(this.searchGroupValue.name) : false) ||
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
    this.itemSOService.items = usersFilterByKeyword;
  }

  reset() {
    this.searchGroup.reset();
    this.itemSOService.items = this.itemsFilter;
  }

  sort(state: ITableState) {
    if (state.sorting) {
      this.itemSOService.items = this.itemsFilter
        .sort(
          sort_by(
            state.sorting.column,
            state.sorting.direction === "asc" ? true : false,
            (a) => a
          )
        )
        .slice(0, this.itemSOService?.paginator.pageSize);
    }
    if (state.paginator) {
      this.itemSOService.items = this.itemsFilter.slice(
        (state.paginator.page - 1) * state.paginator.pageSize,
        state.paginator.page * state.paginator.pageSize
      );
    }
  }
}
