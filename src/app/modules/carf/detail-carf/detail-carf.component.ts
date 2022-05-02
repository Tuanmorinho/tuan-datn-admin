import { ChangeDetectorRef, Component } from '@angular/core';
import { BaseComponent } from '@app/modules/core/base/base.component';
import { ComponentService } from '@app/services/component.service';

@Component({
  selector: 'app-detail-carf',
  templateUrl: './detail-carf.component.html',
  styleUrls: ['./detail-carf.component.scss']
})
export class DetailCarfComponent extends BaseComponent {
  isLoading$: any;
  reviewProcesses = [];
  constructor(
    protected service: ComponentService,
    public ref: ChangeDetectorRef,
  ) {
    super(service);
  }

  async ngOnInit() {
    this.service.subheaderService.updateSubBreadcrumbs([
      {
        title: 'Kết quả báo cáo',
        linkPath: this.router.url,
        linkText: 'Chi tiết kết quả báo cáo',
      }
    ], 'Kết quả báo cáo');
  }
}