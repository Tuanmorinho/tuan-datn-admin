import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { BaseComponent } from "@app/modules/core/base/base.component";
import { ExcelSheetComponent } from "@app/modules/core/reusable-components/excel-sheet/excel-sheet.component";
import { ColumnConfig } from "@app/modules/core/table/_models/column.config";
import { ITEM_GROUP } from "@app/modules/core/utils/constants";
import { cleanObject } from "@app/modules/core/utils/helpers";
import { ComponentService } from "@app/services/component.service";
import { SupplierService } from "@app/services/supplier.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ItemGroupModel } from "../../sku/models/item-group.model";
import { ActionCellSupplierComponent } from "../components/action-cell-supplier/action-cell-supplier.component";
import { DetailCellSupplierComponent } from "../components/detail-cell-supplier/detail-cell-supplier.component";
import { SupplierModel } from "../models/supplier.model";

@Component({
  selector: "app-list-supplier",
  templateUrl: "./list-supplier.component.html",
  styleUrls: ["./list-supplier.component.scss"],
})
export class ListSupplierComponent extends BaseComponent {
  isLoading$: any;
  searchGroup: FormGroup;
  itemGroups: ItemGroupModel[] = ITEM_GROUP;
  listSuppliers: SupplierModel[] = [];
  columnsConfig: ColumnConfig[] = [
    {
      label: "Tên nhà cung cấp",
      dataKey: "name",
      sort: true,
      minWidth: 150,
      component: DetailCellSupplierComponent,
    },
    { label: "Mã nhà cung cấp", dataKey: "code", sort: true, minWidth: 200 },
    {
      label: "Loại vật tư cung cấp", dataKey: "groupItemNames", sort: false, minWidth: 300
    },
    { label: "Email", dataKey: "email", sort: true, minWidth: 200 },
    { label: "Số điện thoại", dataKey: "phone", sort: true, minWidth: 150 },
    {
      label: "Hành động",
      dataKey: "actionCell",
      minWidth: 120,
      sort: false,
      component: ActionCellSupplierComponent,
    },
  ];

  constructor(
    public supplierService: SupplierService,
    protected service: ComponentService,
    public ref: ChangeDetectorRef,
    private fb: FormBuilder,
    private modalService: NgbModal
  ) {
    super(service);
    this.isLoading$ = this.supplierService.isLoading$;
  }

  ngOnInit() {
    if (!this.isModal) {
      this.service.subheaderService.updateBreadcrumbs(
        [
          {
            title: "Danh sách nhà cung cấp",
            linkPath: this.router.url,
            linkText: "Danh sách nhà cung cấp",
          },
        ],
        "Trang chủ",
        [
          {
            name: "Import file",
            class: "btn btn-outline-primary mr-2",
            icon: 'fa fa-upload icon-sm',
            isEvent: true,
            type: 'upload',
          },
          {
            name: 'Thêm nhà cung cấp',
            class: 'btn btn-primary',
            icon: 'ki ki-plus icon-sm',
            url: '/warehouse/supplier/add'
          }
        ],
        'Danh sách nhà cung cấp'
      );
    } else {
      this.columnsConfig.splice(-1, 1);
    }

    this.subscription = this.service.subheaderService.eventEmit.subscribe(v => {
      if (v === 'upload') {
        this.uploadFileModal();
      }
    })

    this.supplierService.patchState({
      filter: { whseId: 'BFMS' },
    });
    this.searchGroup = this.fb.group({
      whseId: ['BFMS'],
      name: [],
      codeLike: [],
      groupCode: []
    });
  }

  uploadFileModal() {
    const modalRef = this.modalService.open(ExcelSheetComponent, { size: 'xl', centered: true, backdrop: 'static' })
    modalRef.componentInstance.isForm = true;
    modalRef.componentInstance.baseService = this.supplierService;
  }

  get searchGroupValue() {
    return this.searchGroup.value;
  }

  search() {
    this.supplierService.patchState({
      filter: cleanObject(this.searchGroupValue),
    });
  }

  reset() {
    this.searchGroup.reset({
      whseId: 'BFMS',
      name: '',
      codeLike: '',
      groupCode: ''
    });
    this.supplierService.patchState({
      filter: cleanObject(this.searchGroupValue),
    });
  }

  public sort(state) {
    this.supplierService.fetch();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.supplierService.subscriptions.forEach((sb) => sb.unsubscribe());
  }
}
