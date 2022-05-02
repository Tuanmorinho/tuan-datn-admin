import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from '@app/modules/core/base/base.component';
import { ConfirmModalComponent } from '@app/modules/core/confirm-modal/confirm-modal.component';
import { ComponentService } from '@app/services/component.service';
import { HouseholdService } from '@app/services/household.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-action-cell',
  templateUrl: './action-cell.component.html',
  styleUrls: ['./action-cell.component.scss']
})
export class HouseHoldActionCellComponent extends BaseComponent implements OnInit {
  @Input() prop: any;

  constructor(
    protected service: ComponentService,
    public householdService: HouseholdService,
    private modalService: NgbModal,
    public ref: ChangeDetectorRef,
  ) {
    super(service);
  }

  ngOnInit(): void {
  }

  delete(data: any) {
    const modalRef = this.modalService.open(ConfirmModalComponent, { centered: true });
    modalRef.componentInstance.info = {
      title: 'Xóa hộ gia đình',
      content: 'Bạn có muốn xóa hộ gia đình ' + data.registrationBookCode
    };
    modalRef.componentInstance.ids = data.id;
    modalRef.closed.subscribe(v => {
      if (v) {
        this.householdService.delete(data.id).subscribe(v => {
          this.service.alertFlashService.success(['Xóa thành công'], this.optionsAlert);
          this.householdService.fetch();
        })
        window.scrollTo(0, 0);
      }
    });
  }
}
