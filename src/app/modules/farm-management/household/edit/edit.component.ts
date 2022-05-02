import { formatDate } from "@angular/common";
import { ChangeDetectorRef, Component } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { BaseComponent } from "@app/modules/core/base/base.component";
import { ConfirmModalComponent } from "@app/modules/core/confirm-modal/confirm-modal.component";
import { SelectionModalComponent } from "@app/modules/core/selection-modal/selection-modal.component";
import { ComponentService } from "@app/services/component.service";
import { HouseholdService } from "@app/services/household.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MemberComponent } from "../components/member-component/member-component.component";

@Component({
  selector: "app-household-edit",
  templateUrl: "./edit.component.html",
  styleUrls: ["./edit.component.scss"],
})
export class HouseHoldEditComponent extends BaseComponent {
  memebers = [];
  registrationBookCode: any;
  loading$: any;

  constructor(
    protected service: ComponentService,
    private householdService: HouseholdService,
    public ref: ChangeDetectorRef,
    private modalService: NgbModal,
  ) {
    super(service);
    this.loading$ = householdService.isLoading$;
  }

  ngOnInit() {
    this.service.subheaderService.updateBreadcrumbs(
      [
        {
          title: 'Quản lý hộ gia đình',
          linkPath: '/farm-management/household',
          linkText: 'Quản lý hộ gia đình',
        },
        {
          title: this.routeParams.id ? "Chỉnh sửa hộ gia đình" : "Thêm hộ gia đình",
          linkPath: this.router.url,
          linkText: this.routeParams.id ? "Chỉnh sửa hộ gia đình" : "Thêm hộ gia đình",
        }
      ], 'Trang chủ',
      [],
      'Cập nhật thông tin hộ gia đình'
    );

    this.householdService.getItemById(Number(this.routeParams.id)).subscribe((v: any) => {
      this.memebers = v.members;
      this.registrationBookCode = v.registrationBookCode;
      this.ref.detectChanges();
    })
  }

  get v() {
    return this.formGroup.value;
  }

  /**
   * 
   * @param index index of member
   */
  addMember(index: number = -1, member: any = null) {
    const modalRef = this.modalService.open(SelectionModalComponent, { size: 'xl', centered: true, backdrop: 'static' });
    modalRef.componentInstance.component = MemberComponent;
    modalRef.componentInstance.isForm = true;

    if (index != -1) {
      // trường hợp chỉnh sửa
      member.isEdit = true;
      modalRef.componentInstance.filter = member;
      this.ref.detectChanges();
    } else {
      // trường hợp thêm mới
      modalRef.componentInstance.filter = {
        isEdit: true,
        permanentCountry: this.v.permanentCountry,
        permanentProvince: this.v.permanentProvince,
        permanentDistrict: this.v.permanentDistrict,
        permanentWard: this.v.permanentWard,
        permanentAddress: this.v.permanentAddress,
        permanentCountryId: this.v.permanentCountryId,
        permanentProvinceId: this.v.permanentProvinceId,
        permanentDistrictId: this.v.permanentDistrictId,
        permanentWardId: this.v.permanentWardId,
        temporaryAddress: this.v.temporaryAddress,
        temporaryCountryId: this.v.temporaryCountryId,
        temporaryProvinceId: this.v.temporaryProvinceId,
        temporaryDistrictId: this.v.temporaryDistrictId,
        temporaryWardId: this.v.temporaryWardId,
        temporaryCountry: this.v.temporaryCountry,
        temporaryProvince: this.v.temporaryProvince,
        temporaryDistrict: this.v.temporaryDistrict,
        temporaryWard: this.v.temporaryWard,
      }
      this.ref.detectChanges();
    }

    modalRef.closed.subscribe(res => {
      if (index != -1) {
        this.memebers[index] = {
          ...res,
          birthday: formatDate(res.birthday, 'yyyy-MM-dd', 'vi_VI'),
        }
      } else {
        this.memebers.push({
          ...res,
          birthday: formatDate(res.birthday, 'yyyy-MM-dd', 'vi_VI'),
          role: 'MEMBER',
          identifyType: "CCCD",
        });
      }
      this.ref.detectChanges();
    })
  }

  updateEvent(data: any) {
    this.addMember(data.index, data.member);
  }

  deleteEvent(data: any) {
    const modalRef = this.modalService.open(ConfirmModalComponent, { centered: true });
    modalRef.componentInstance.info = {
      title: 'Xoá thành viên',
      content: 'Bạn muốn xóa thành viên ' + data?.member?.fullname
    }
    modalRef.closed.subscribe(v => {
      if (v) {
        this.householdService.deleteMemberInfo(data.member?.id, Number(this.routeParams.id)).subscribe(_ => {
          this.memebers.splice(data.index, 1);
          this.service.alertFlashService.success(['Xóa thành công'], this.optionsAlert);
        }, e => this.showError(e, this.ref));
      }
      window.scrollTo(0, 0);
      this.ref.detectChanges();
    });
  }
}
