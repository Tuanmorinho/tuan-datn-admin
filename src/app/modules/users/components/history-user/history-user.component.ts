import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { BaseComponent } from "@app/modules/core/base/base.component";
import { ColumnConfig } from "@app/modules/core/table/_models/column.config";
import { ComponentService } from "@app/services/component.service";
import { UsersHistoryService } from "@app/services/users-history.service";

@Component({
  selector: "app-history-user",
  templateUrl: "./history-user.component.html",
  styleUrls: ["./history-user.component.scss"],
})
export class HistoryUserComponent extends BaseComponent implements OnInit {
  @Input() idParam;

  searchGroup: FormGroup;
  historyList: any;
  roleList: [];
  columnsConfig: ColumnConfig[] = [
    { label: "Địa chỉ IP", dataKey: "ipAddress", sort: false, minWidth: 150 },
    { label: "Ngày bắt đầu", dataKey: "start", sort: false, minWidth: 150 },
    { label: "Ngày kết thúc", dataKey: "lastAccess", sort: false },
    { label: "Hành động", dataKey: "", sort: false, predict: (item) => 'Đăng nhập' },
  ];
  constructor(
    public usersHistoryService: UsersHistoryService,
    protected service: ComponentService,
    public ref: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
    super(service);
  }

  async ngOnInit() {
    this.searchGroup = this.fb.group({
      thisMonth: [],
      fromDate: [],
      toDate: [],
    });

    this.usersHistoryService.patchState({
      filter: { userId: this.routeParams.id },
    });
  }

  sort(state) {}
}
