import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/modules/core/base/base.component';
import { ComponentService } from '@app/services/component.service';
import { FarmingContractsService } from '@app/services/farming-contracts.service';
import { UploadFileService } from '@app/services/upload-file.service';
import {saveAs as importedSaveAs} from "file-saver";

@Component({
  selector: 'app-detail-farming-contracts',
  templateUrl: './detail-farming-contracts.component.html',
  styleUrls: ['./detail-farming-contracts.component.scss']
})
export class DetailFarmingContractsComponent  extends BaseComponent implements OnInit {
  farmingContract: any;

  constructor(
    protected service: ComponentService,
    public farmContractsService: FarmingContractsService,
    protected uploadFileService: UploadFileService,
    public ref: ChangeDetectorRef
  ) {
    super(service);
  }
  ngOnInit() {
    this.service.subheaderService.updateBreadcrumbs(
      [
        {
          title: "Danh sách hợp đồng canh tác",
          linkPath: '/farm-management/farming-contract',
        },
        {
          title: 'Thông tin hợp đồng',
          linkPath: this.router.url,
        }
      ], 'Trang chủ',
      [
        {
          name: 'Thoát',
          url: '/farm-management/farming-contract',
          class: 'btn btn-outline-dark mr-3'
        }
      ], 'Chi tiết hợp đồng canh tác');

    this.farmContractsService.getItemById(this.routeParams.id).subscribe((x:any) => {
      this.farmingContract = x;
      if (x?.status === 'PENDING' || x?.status === 'EFFECTIVE') {
        this.service.subheaderService.updateBreadcrumbs(
          [
            {
              title: "Danh sách hợp đồng canh tác",
              linkPath: '/farm-management/farming-contract',
            },
            {
              title: 'Thông tin hợp đồng',
              linkPath: this.router.url,
            }
          ], 'Trang chủ',
          [
            {
              name: 'Thoát',
              url: '/farm-management/farming-contract',
              class: 'btn btn-outline-dark mr-3'
            },
            {
              name: 'Chỉnh sửa',
              url: '/farm-management/farming-contract/edit/' + this.routeParams.id,
              class: 'btn btn-primary ',
            }
          ], 'Chi tiết hợp đồng canh tác');
      }
    });
  }

  downloadFile(file: any) {
    const bucket = file?.bucket ? file?.bucket : '';
    const fileName = file?.key ? file?.key : '';
    this.farmContractsService.isLoading = true;
    this.uploadFileService.downloadFile(bucket, fileName).subscribe(v => {
      if (v) {
        importedSaveAs(v, file.name);
        this.farmContractsService.isLoading = false;
      }
    }, _ => {
      this.farmContractsService.isLoading = false;
    })
  }
}
