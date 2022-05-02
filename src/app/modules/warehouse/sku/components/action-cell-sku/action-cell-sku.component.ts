import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from '@app/modules/core/base/base.component';
import { ConfirmModalComponent } from '@app/modules/core/confirm-modal/confirm-modal.component';
import { DeleteModalComponent } from '@app/modules/core/delete-modal/delete-modal.component';
import { SKUModel } from '@app/modules/warehouse/sku/models/sku.model';
import { ComponentService } from '@app/services/component.service';
import { SkuService } from '@app/services/sku.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-action-cell-sku',
  templateUrl: './action-cell-sku.component.html',
  styleUrls: ['./action-cell-sku.component.scss']
})
export class ActionCellSkuComponent extends BaseComponent implements OnInit {
  @Input() prop: any;

  constructor(
    private modalService: NgbModal,
    protected service: ComponentService,
    private skuService: SkuService
  ) {     super(service);
  }

  ngOnInit(): void {
  }

  delete(prop: SKUModel) {
    const modalRef = this.modalService.open(ConfirmModalComponent, { centered: true });
    modalRef.componentInstance.info = {
      title: 'Xóa vật tư',
      content: 'Bạn có muốn xóa vật tư' 
    };
    modalRef.closed.subscribe(v => {
      if (v) {
        this.skuService.deleteSkuItem({
          id: prop.id,
          code: prop.code,
          whseId: 'BFMS',
          storerKey: 'FARM'
        }).subscribe(v => {
          this.service.alertFlashService.success(['Xóa thành công'], this.optionsAlert);
          this.skuService.fetch();
        });
      }
    });
  }
}
