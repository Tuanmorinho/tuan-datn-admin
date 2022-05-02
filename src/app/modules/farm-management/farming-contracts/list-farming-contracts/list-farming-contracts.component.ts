import { formatDate } from "@angular/common";
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { BaseComponent } from "@app/modules/core/base/base.component";
import { ColumnConfig } from "@app/modules/core/table/_models/column.config";
import { cleanObject } from "@app/modules/core/utils/helpers";
import { ComponentService } from "@app/services/component.service";
import { FarmingContractsService } from "@app/services/farming-contracts.service";
import { HouseholdService } from "@app/services/household.service";
import { InitDataService } from "@app/services/init-data.service";
import { FarmingContractActionCellComponent } from "../components/action-cell/action-cell.component";
import { DetailCellFarmingContractsComponent } from "../components/detail-cell-farming-contracts/detail-cell-farming-contracts.component";

@Component({
  selector: "app-list-farming-contracts",
  templateUrl: "./list-farming-contracts.component.html",
  styleUrls: ["./list-farming-contracts.component.scss"],
})
export class ListFarmingContractsComponent extends BaseComponent implements OnDestroy {
  isLoading$: any;
  searchGroup: FormGroup;
  statusContracts: any = [];
  households = [];
  isShowHouseholdList = false;

  columnsConfig: ColumnConfig[] = [
    { label: "Số hợp đồng", dataKey: "", sort: false, minWidth: 150, component: DetailCellFarmingContractsComponent },
    { label: "Hộ gia đình", dataKey: "item.household.owner.fullname", sort: true, minWidth: 150, predict: (item) => item.household.owner.fullname },
    { label: "Mã hộ gia đình", dataKey: "household.registrationBookCode", sort: true, minWidth: 150, predict: (item) => item.household.registrationBookCode },
    { label: "Ngày bắt đầu", dataKey: "startDate", sort: false, minWidth: 150, predict: (item) => formatDate(item.createdAt, 'dd/MM/yyyy', 'vi_VI') },
    { label: "Ngày kết thúc", dataKey: "endDate", sort: false, minWidth: 150, predict: (item) => formatDate(item.endDate, 'dd/MM/yyyy', 'vi_VI') },
    {
      label: "Trạng thái",
      dataKey: "status",
      sort: true,
      minWidth: 150,
      component: ContractCellComponent
    },
    {
      label: "Hành động",
      dataKey: "actionCell",
      minWidth: 120,
      sort: false,
      component: FarmingContractActionCellComponent
    },
  ];

  constructor(
    protected service: ComponentService,
    public contractsService: FarmingContractsService,
    private houseHoldService: HouseholdService,
    private initDataService: InitDataService,
    public ref: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
    super(service);
    this.isLoading$ = this.contractsService.isLoading$;

  }
  async ngOnInit() {
    this.service.subheaderService.updateBreadcrumbs(
      [
        {
          title: "Quản lý hợp đồng canh tác",
          linkPath: this.router.url,
          linkText: "QUản lý hợp đồng canh tác",
        },
      ],
      "Trang chủ",
      [],
      'Danh sách hợp đồng'
    );
    if (!this.isModal && this.filter?.householdId) {
      this.service.subheaderService.setBreadcrumbsBtn([
        {
          name: "Thoát",
          url: "/farm-management/household",
          class: "btn btn-outline-dark get-data btn-elevate mr-3",
        },
        {
          name: 'Thêm hợp đồng canh tác',
          icon: 'ki ki-plus icon-sm',
          url: '/farm-management/farming-contract/add',
          queryParams: {householdId: this.filter?.householdId},
          class: 'btn btn-primary',
        }
      ])
    }
    if (!this.isModal && !this.filter?.householdId) {
      this.service.subheaderService.setBreadcrumbsBtn([
        {
          name: 'Thêm hợp đồng canh tác',
          icon: 'ki ki-plus icon-sm',
          url: '/farm-management/farming-contract/add',
          class: 'btn btn-primary',
        }
      ])
    }
    this.searchGroup = this.fb.group({
      q: [""],
      status: [],
      householdId: []
    });

    this.initDataService.getInitDataHouseHold().subscribe((v: any) => {
      this.statusContracts = v.farmingContractStatus
    });
    this.houseHoldService.getHouseholdList().subscribe((v: any) => {
      this.households = v.data;
    });

    if (this.filter) {
      this.contractsService.patchState({
        filter: this.filter,
      });
    } else {
      this.isShowHouseholdList = true;
      this.contractsService.fetch();
    }
  }

  get searchGroupValue() {
    return this.searchGroup.value;
  }

  reset() {
    this.searchGroup.reset();
    this.contractsService.patchState({
      filter: {},
    });
  }

  search() {
    const filter = cleanObject(this.searchGroupValue);
    this.contractsService.patchState({
      filter,
    });
  }

  sort(state) {
    this.contractsService.fetch();
  }

  ngOnDestroy(): void { }
}

@Component({
  template: `
      <p [attr.class]="className">
        {{ prop?.status === 'EFFECTIVE' ? 'Còn hiệu lực' : '' }}
        {{ prop?.status === 'EXPIRED' ? 'Hết hiệu lực' : '' }}
        {{ prop?.status === 'PENDING' ? 'Chưa bắt đầu' : '' }}
      </p>
  `, styleUrls: ["./list-farming-contracts.component.scss"],
})
export class ContractCellComponent implements OnInit {
  @Input() prop;
  className: string;

  ngOnInit(): void {
    switch (this.prop?.status) {
      case 'EFFECTIVE':
        this.className = 'status userActive'
        break;
      case 'EXPIRED':
        this.className = 'status userDisable'
        break;
      case 'PENDING':
        this.className = 'status userPending'
        break;
    }
  }
}
