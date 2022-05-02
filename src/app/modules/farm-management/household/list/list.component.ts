import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { BaseComponent } from "@app/modules/core/base/base.component";
import { ColumnConfig } from "@app/modules/core/table/_models/column.config";
import { PROVINCE } from "@app/modules/core/utils/constants";
import { cleanObject } from "@app/modules/core/utils/helpers";
import { ComponentService } from "@app/services/component.service";
import { HouseholdService } from "@app/services/household.service";
import { InitDataService } from "@app/services/init-data.service";
import { HouseHoldActionCellComponent } from "../components/action-cell/action-cell.component";
import { HouseHoldDetailcellComponent } from "../components/detail-cell/detail-cell.component";
import { StatusSlideCellComponent } from "../components/status-slide-cell/status-slide-cell.component";
import { InitDataHouseHoldModel } from "../models/init-data.model";

@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"],
})
export class ListComponent extends BaseComponent implements OnDestroy {  
  searchGroup: FormGroup;
  initDataHousehold: InitDataHouseHoldModel;
  province: any;

  columnsConfig: ColumnConfig[] = [
    {
      label: "Hộ gia đình",
      dataKey: "",
      sort: false,
      minWidth: 150,
      component: HouseHoldDetailcellComponent,
    },
    {
      label: "Mã hộ gia đình",
      dataKey: "registrationBookCode",
      sort: true,
      minWidth: 120,
    },
    {
      label: "CCCD/CMND",
      dataKey: "owner.identifyCode",
      sort: true,
      minWidth: 120,
      predict: (prop) => prop?.owner?.identifyCode,
    },
    {
      label: "Số điện thoại ",
      dataKey: "owner.phone",
      sort: true,
      minWidth: 150,
      predict: (prop) => prop?.owner?.phone,
    },
    {
      label: "Trạng thái",
      dataKey: "status",
      sort: true,
      minWidth: 120,
      component: StatusHouseHoldComponent
    },
    {
      label: "Hành động",
      dataKey: "actionCell",
      minWidth: 150,
      sort: false,
      component: HouseHoldActionCellComponent,
    },
  ];

  isLoading$: any;
  constructor(
    protected service: ComponentService,
    public householdService: HouseholdService,
    public ref: ChangeDetectorRef,
    private fb: FormBuilder,
    private initDataService: InitDataService
  ) {
    super(service);
    this.isLoading$ = this.householdService.isLoading$;
  }

  ngOnInit(): void {
    if (!this.isModal) {
      this.service.subheaderService.updateBreadcrumbs(
        [
          {
            title: "Quản lý hộ gia đình",
            linkPath: this.router.url,
            linkText: "Quản lý hộ gia đình",
          },
        ],
        "Trang chủ",
        [
          {
            name: 'Thêm hộ gia đình',
            icon: 'ki ki-plus icon-sm',
            url: '/farm-management/household/add',
            class: 'btn btn-primary',
          }
        ],
        'Danh sách hộ gia đình'
      );
    }
    this.initDataService.getInitDataHouseHold().subscribe((v: InitDataHouseHoldModel) => this.initDataHousehold = v);
    this.initDataService.getInitDataDetailHousehold(1).subscribe(v => this.province = v)
      
    this.householdService.fetch();

    this.searchGroup = this.fb.group({
      name: [""],
      email: [""],
      phone: [""],
      identifyCode: [""],
      permanentProvinceId: [],
      status: []
    });
  }

  search() {
    this.householdService.patchState({
      filter: cleanObject(this.searchGroup.value)
    });
  }

  reset() {
    this.searchGroup.reset();
    this.householdService.patchState({
      filter: {},
    });
  }

  sort(state) {
    this.householdService.fetch();
  }
}

@Component({
  template: `
      <p [attr.class]="className">
        {{ prop?.status === 'WAITING_APPROVE' ? 'Chờ phê duyệt' : '' }}
        {{ prop?.status === 'REJECT' ? 'Từ chối' : '' }}
        {{ prop?.status === 'ACTIVE' ? 'Đang hoạt động' : '' }}
        {{ prop?.status === 'INACTIVE' ? 'Dừng hoạt động' : '' }}
      </p>
  `,
  styleUrls: ["./list.component.scss"]
})
export class StatusHouseHoldComponent implements OnInit {
  @Input() prop: any;
  className: string;

  ngOnInit(): void {
    switch (this.prop?.status) {
      case 'WAITING_APPROVE':
        this.className = 'status waiting'
        break;
      case 'REJECT':
        this.className = 'status reject'
        break;
      case 'ACTIVE':
        this.className = 'status active'
        break;
      case 'INACTIVE':
        this.className = 'status inactive'
    }
  }
  
}  
