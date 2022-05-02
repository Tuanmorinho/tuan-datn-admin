import { CustomerService } from './../../../../services/customer.service';
import { ChangeDetectorRef, Component, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { BaseComponent } from "@app/modules/core/base/base.component";
import { ColumnConfig } from "@app/modules/core/table/_models/column.config";
import { ComponentService } from "@app/services/component.service";
import { DetailCellCustomerComponent } from "../components/detail-cell-customer/detail-cell-customer.component";
import { ActionCellCustomerComponent } from "../components/action-cell-customer/action-cell-customer.component";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExcelSheetComponent } from '@app/modules/core/reusable-components/excel-sheet/excel-sheet.component';

@Component({
  selector: "app-customer",
  templateUrl: "./customer.component.html",
  styleUrls: ["./customer.component.scss"],
})
export class CustomerComponent extends BaseComponent implements OnDestroy {
  searchGroup: FormGroup;
  columnsConfig: ColumnConfig[] = [
    {
      label: "Tên khách hàng",
      dataKey: "name",
      sort: true,
      minWidth: 150,
      component: DetailCellCustomerComponent,
    },
    { label: "Mã khách hàng", dataKey: "code", sort: true, minWidth: 150 },
    { label: "Email", dataKey: "email", sort: true, minWidth: 120 },
    { label: "Số điện thoại", dataKey: "phone", sort: true, minWidth: 120 },
    { label: "Địa chỉ", dataKey: "address", sort: true, minWidth: 150 },
    { label: "Mã số thuế", dataKey: "taxCode", sort: true, minWidth: 120 },
    {
      label: "Hành động",
      dataKey: "actionCell",
      minWidth: 120,
      sort: false,
      component: ActionCellCustomerComponent,
    },
  ];

  constructor(
    public customerService: CustomerService,
    protected service: ComponentService,
    public ref: ChangeDetectorRef,
    private fb: FormBuilder,
    private modalService: NgbModal
  ) {
    super(service);
  }

  async ngOnInit() {
    if (!this.isModal) {
      this.service.subheaderService.updateBreadcrumbs(
        [
          {
            title: "Danh sách khách hàng",
            linkPath: this.router.url,
          }
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
            name: 'Thêm khách hàng',
            class: 'btn btn-primary',
            icon: 'ki ki-plus icon-sm',
            url: '/warehouse/customer/add'
          }
        ],
        'Danh sách khách hàng'
      );
    } else {
      this.columnsConfig.splice(-1, 1);
    }
    
    this.subscription = this.service.subheaderService.eventEmit.subscribe(v => {
      if (v === 'upload') {
        this.uploadFileModal();
      }
    })
    
    this.customerService.patchState({
      filter: { whseId: 'BFMS' },
    });
    this.searchGroup = this.fb.group({
      whseId: ['BFMS'],
      codeLike: [''],
      name: ['']
    });
  }

  get searchGroupValue() {
    return this.searchGroup.value;
  }

  uploadFileModal() {
    const modalRef = this.modalService.open(ExcelSheetComponent, { size: 'xl', centered: true, backdrop: 'static' })
    modalRef.componentInstance.isForm = true;
    modalRef.componentInstance.baseService = this.customerService;
  }

  search() {
    const data = this.searchGroupValue;

    this.customerService.patchState({
      filter: data,
    });    
  }

  reset() {
    this.searchGroup.reset({
      whseId: 'BFMS',
      codeLike: '',
      name: ''
    });

    this.customerService.patchState({
      filter: this.searchGroup.value
    });
  }

  public sort(state) {
    this.customerService.fetch();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.customerService.subscriptions.forEach((sb) => sb.unsubscribe());
  }
}
