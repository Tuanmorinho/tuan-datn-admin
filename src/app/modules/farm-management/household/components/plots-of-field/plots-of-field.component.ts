import { BaseComponent } from '@app/modules/core/base/base.component';
import { Component, OnInit } from '@angular/core';
import { ComponentService } from '@app/services/component.service';
import { HouseholdService } from '@app/services/household.service';

@Component({
  selector: 'app-plots-of-field',
  templateUrl: './plots-of-field.component.html',
  styleUrls: ['./plots-of-field.component.scss']
})
export class PlotsOfFieldComponent extends BaseComponent implements OnInit {

  totalField: number = 0;
  fields: any = [];

  constructor(
    protected service: ComponentService,
    public householdService: HouseholdService,
  ) {
    super(service);
  }

  ngOnInit(): void {
    // this.service.subheaderService.updateBreadcrumbs(
    //   [
    //     {
    //       title: "Quản lý hộ gia đình",
    //       linkPath: '/farm-management/household',
    //       linkText: 'Quản lý hộ gia đình',
    //     },
    //     {
    //       title: "Chi tiết hộ gia đình",
    //       linkPath: this.router.url,
    //       linkText: 'Chi tiết hộ gia đình',
    //     },
    //     {
    //       title: "Thông tin thửa ruộng",
    //       linkPath: this.router.url,
    //       linkText: "Thông tin thửa ruộng",
    //     },
    //   ], "Trang chủ"
    // );
  }

}
