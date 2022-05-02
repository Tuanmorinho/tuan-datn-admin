import { BaseComponent } from '../../../../core/base/base.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { HouseholdService } from '@app/services/household.service';
import { ComponentService } from '@app/services/component.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '@app/modules/core/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-status-slide-cell',
  templateUrl: './status-slide-cell.component.html',
  styleUrls: ['./status-slide-cell.component.scss']
})
export class StatusSlideCellComponent extends BaseComponent implements OnInit {
  @Input() prop: any;

  formGroup: FormGroup;

  constructor(
    protected service: ComponentService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    public householdService: HouseholdService,
    public ref: ChangeDetectorRef
  ) {
    super(service)
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      statusToggle: '',
    })
    this.formGroup.patchValue({
      statusToggle: this.prop.status === "ACTIVE" ? true : false
    })
  }

  get v() {
    return this.formGroup.value;
  }

  onChange(value) {
    this.prop.owner = {...this.prop.owner, status: value.checked === true ? "ACTIVE" : "INACTIVE"}

    const modalRef = this.modalService.open(ConfirmModalComponent, { centered: true });
    modalRef.componentInstance.info = {
      title: 'Chỉnh sửa',
      content: 'Bạn có muốn thay đổi trạng thái của ' + this.prop.owner?.fullname + '?'
    };
    modalRef.closed.subscribe(v => {
      if (!v) {
        this.formGroup.patchValue({
          statusToggle: true
        })
      }
      if (v) {
        this.onSubmit();
        if (v.error) {
          this.showError(v.error, this.ref);
        }
        window.scrollTo(0, 0);
      }
    });
  }

  onSubmit() {
    this.householdService.updateMemberInfo(this.prop.owner, this.prop.id).subscribe(_ => {
      this.service.alertFlashService.success(['Cập nhật trạng thái thành công'], this.optionsAlert);
      this.householdService.fetch();
    }, error => {
      this.showError(error, this.ref);
      this.formGroup.patchValue({
        statusToggle: true
      })
    })
  }
}
