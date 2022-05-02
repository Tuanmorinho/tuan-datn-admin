import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { BaseComponent } from '@app/modules/core/base/base.component';
import { ComponentService } from '@app/services/component.service';
import { ConfirmModalComponent } from '@app/modules/core/confirm-modal/confirm-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HouseholdService } from '@app/services/household.service';
import { MemberComponent } from '../member-component/member-component.component';
import { OffcanvasService } from '@app/services/offcanvas.service';

@Component({
  selector: 'app-detail-member',
  templateUrl: './detail-member.component.html',
  styleUrls: ['./detail-member.component.scss']
})
export class DetailMemberComponent extends BaseComponent {
  member: any;
  component: any
  constructor(
    protected service: ComponentService,
    public householdService: HouseholdService,
    public ref: ChangeDetectorRef,
    private modalService: NgbModal,
    public offcanvasService: OffcanvasService,
  ) {
    super(service);
  }

  ngOnInit(): void {
    this.member = this.filter;
  }

  onUpdate() {
    this.component = MemberComponent;
    let toggleBtn = document.getElementById("kt_quick_custom_toggle");
    if (toggleBtn) {
      toggleBtn.click();
    }
  }

  onDelete() {
    const modalRef = this.modalService.open(ConfirmModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.info = {
      title: "Xóa thành viên",
      content: "Bạn có muốn xóa thành viên",
    };
    modalRef.closed.subscribe((v) => {
      if (v) {
        this.householdService.deleteMemberInfo(this.member?.id, Number(this.routeParams.id)).subscribe(_ => {
          this.service.alertFlashService.success(['Xóa thành công'], this.optionsAlert);
          this.closeOffCanvas();
        }, e => this.showError(e, this.ref));
      }
    });
  }

  closeOffCanvas() {
    this.offcanvasService.closeValue = {};
    let toggleBtn = document.getElementById("kt_quick_custom_close");
    if (toggleBtn) {
      toggleBtn.click();
    }
  }
}
