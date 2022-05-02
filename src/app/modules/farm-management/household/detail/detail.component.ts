import { UploadFileService } from "@services/upload-file.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { BaseComponent } from "@app/modules/core/base/base.component";
import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  ViewChild,
} from "@angular/core";
import { ComponentService } from "@app/services/component.service";
import { HouseholdService } from "@app/services/household.service";
import { ConfirmModalComponent } from "@app/modules/core/confirm-modal/confirm-modal.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import KTLayoutQuickCustom from "../../../../../assets/js/layout/extended/quick-custom";
import { KTUtil } from "../../../../../assets/js/components/util";
import { OffcanvasService } from "@app/services/offcanvas.service";
import { MemberComponent } from "../components/member-component/member-component.component";
import { mergeMap } from "rxjs/operators";
import { DetailMemberComponent } from "../components/detail-member/detail-member.component";
@Component({
  selector: "app-detail",
  templateUrl: "./detail.component.html",
  styleUrls: ["./detail.component.scss"],
})
export class HouseHoldDetailComponent extends BaseComponent {
  activeBtnPrx: string = "";
  activeBtnHh: string = "btn-proxy-infor-active";
  activeBtnPloF: string = "";
  activeBtnContr: string = "";
  //
  activePrx: boolean = false;
  activeHh: boolean = true;
  activePloF: boolean = false;
  activeContr: boolean = false;
  component: any = MemberComponent;
  memberIndex: number = -1;
  member: any = null;
  formGroup: FormGroup;
  show: boolean = true;
  imageUrl: any = "./assets/media/svg/icons/Common/Group.svg";

  detailHousehold: any;

  filter = {
    householdId: Number(this.routeParams.id),
  };

  constructor(
    protected service: ComponentService,
    public householdService: HouseholdService,
    private fb: FormBuilder,
    protected uploadFileService: UploadFileService,
    public ref: ChangeDetectorRef,
    private modalService: NgbModal,
    private offcanvasService: OffcanvasService
  ) {
    super(service);
  }

  ngOnInit() {
    this.updateBreadcrumbs();    

    this.formGroup = this.fb.group({
      id: Number(this.routeParams.id),
      status: [],
    });
    this.householdService
      .getHouseholdById(this.routeParams.id)
      .subscribe((res: any) => {
        res.members = res.members.map((m) => ({ ...m, isEdit: true }));
        this.detailHousehold = res;
        this.formGroup.patchValue({
          status: res.status
        });
        const buttonArr = [
          {
            name: "Thoát",
            url: "/farm-management/household",
            class: "btn btn-outline-dark get-data btn-elevate mr-3",
            type: '',
            isEvent: false
          }
        ];
        if (res.status === 'WAITING_APPROVE') {
          buttonArr.push({
            name: "Từ chối",
            class: "btn btn-outline-danger get-data btn-elevate mr-3",
            url: '',
            type: "cancel",
            isEvent: true,
          },
          {
            name: "Xét duyệt",
            class: "btn btn-outline-primary get-data btn-elevate",
            url: '',
            type: "approve",
            isEvent: true,
          });
        }
        if (res.status === 'REJECT' || res.status === 'ACTIVE' || res.status === 'INACTIVE') {
          buttonArr.push({
            name: "Xóa",
            class: "btn btn-primary btn-outline-danger get-data btn-elevate mr-3",
            url: '',
            type: "delete",
            isEvent: true,
          })
        } 

        this.service.subheaderService.setBreadcrumbsBtn(buttonArr);
        this.subscription = this.service.subheaderService.eventEmit.subscribe(
          (v) => {
            if (v === "delete") {
              this.onDelete();
            }
            if (v === "approve") {
              this.onChangeStatus('ACTIVE');
            }
            if (v === "cancel") {
              this.onChangeStatus('REJECT');
            }
          }
        );
      });

    this.offcanvasService.closeValue$
      .pipe(
        mergeMap(() =>
          this.householdService.getHouseholdById(this.routeParams.id)
        )
      )
      .subscribe((res: any) => {
        res.members = res.members.map((m) => ({ ...m, isEdit: true }));
        this.detailHousehold = res;
        this.ref.detectChanges();
      });
  }

  addMember(detailHousehold: any) {
    const owner = detailHousehold.members.find(m => m.role === 'OWNER');
    this.component = MemberComponent;
    this.member = {
      isEdit: true,
      permanentCountry: owner?.permanentCountry,
      permanentProvince: owner?.permanentProvince,
      permanentDistrict: owner?.permanentDistrict,
      permanentWard: owner?.permanentWard,
      permanentAddress: owner?.permanentAddress,
      permanentCountryId: owner?.permanentCountryId,
      permanentProvinceId: owner?.permanentProvinceId,
      permanentDistrictId: owner?.permanentDistrictId,
      permanentWardId: owner?.permanentWardId,
      temporaryAddress: owner?.temporaryAddress,
      temporaryCountryId: owner?.temporaryCountryId,
      temporaryProvinceId: owner?.temporaryProvinceId,
      temporaryDistrictId: owner?.temporaryDistrictId,
      temporaryWardId: owner?.temporaryWardId,
      temporaryCountry: owner?.temporaryCountry,
      temporaryProvince: owner?.temporaryProvince,
      temporaryDistrict: owner?.temporaryDistrict,
      temporaryWard: owner?.temporaryWard,
    };
    this.show = true;
    this.ref.detectChanges();
    let toggleBtn = document.getElementById("kt_quick_custom_toggle");
    if (toggleBtn) {
      toggleBtn.click();
    }
  }

  ngAfterViewInit() {
    KTUtil.ready(() => {
      if (true) {
        KTLayoutQuickCustom.init("kt_quick_custom");
      }
    });
  }

  updateBreadcrumbs() {
    if (this.activeHh) {
      this.service.subheaderService.updateBreadcrumbs(
        [
          {
            title: "Quản lý hộ gia đình",
            linkPath: "/farm-management/household",
          },
          {
            title: "Chi tiết thông tin hộ gia đình",
            linkPath: this.router.url,
          },
        ],
        "Trang chủ",
        [
          {
            name: "Thoát",
            url: "/farm-management/household",
            class: "btn btn-outline-dark get-data btn-elevate mr-3",
          },
          {
            name: "Xóa",
            class: "btn btn-primary btn-outline-danger get-data btn-elevate mr-3",
            type: "delete",
            isEvent: true,
          },
          {
            name: "Thêm thành viên",
            isEvent: true,
            class: "btn btn-primary get-data btn-elevate",
            type: "add",
          },
        ],
        "Chi tiết hộ gia đình"
      );
    }
    if (this.activePloF) {
      this.service.subheaderService.updateBreadcrumbs(
        [
          {
            title: "Chi tiết thông tin thửa ruộng",
            linkPath: this.router.url,
          },
        ],
        "Trang chủ",
        [{
          name: "Thoát",
          url: "/farm-management/household",
          class: "btn btn-outline-dark get-data btn-elevate mr-3",
        },],
        "Thông tin thửa ruộng"
      );
    }
  }

  onDetail(evt: { index: number; member: any }) {
    this.component = DetailMemberComponent;
    this.memberIndex = evt.index;
    this.member = evt.member;
    this.show = true;
    this.ref.detectChanges();
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
      title: "Xóa hộ gia đình",
      content: "Bạn có muốn xóa hộ gia đình",
    };
    modalRef.closed.subscribe((v) => {
      if (v) {
        this.householdService.delete(this.routeParams.id).subscribe((v) => {
          this.service.alertFlashService.success(
            ["Xóa thành công"],
            this.optionsAlert
          );
          this.router.navigate(["/farm-management/household"]);
        });
      }
    });
  }

  radioChange(status) {
    const modalRef = this.modalService.open(ConfirmModalComponent, {
      centered: true,
    });
    if (status === 'ACTIVE') {
      modalRef.componentInstance.info = {
        title: "Kích hoạt",
        content: "Bạn có muốn kích hoạt không ?",
      };
      modalRef.componentInstance.iconStatus = 'approve';
    }
    if (status === 'INACTIVE') {
      modalRef.componentInstance.info = {
        title: "Dừng hoạt động",
        content: "Bạn có muốn dừng hoạt động không ?",
      };
      modalRef.componentInstance.iconStatus = 'cancel';
    }
    modalRef.closed.subscribe((v) => {
      if (v) {
        this.householdService.changeStatus(Number(this.routeParams.id), status).subscribe((v) => {
          this.service.alertFlashService.success(
            ["Thay đổi trạng thái thành công"],
            this.optionsAlert
          );
          this.router.navigate(["/farm-management/household"]);
        });
      } else {
        this.formGroup.patchValue({
          status: this.detailHousehold.status
        })
      }
    });
  }

  onChangeStatus(status: string) {
    const modalRef = this.modalService.open(ConfirmModalComponent, {
      centered: true,
    });
    if (status === 'REJECT') {
      modalRef.componentInstance.info = {
        title: "Từ chối",
        content: "Bạn có muốn từ chối yêu cầu xét duyệt này không ?",
      };
      modalRef.componentInstance.iconStatus = 'cancel';
    }
    if (status === 'ACTIVE') {
      modalRef.componentInstance.info = {
        title: "Xét duyệt",
        content: "Bạn có muốn xét duyệt yêu cầu này không ?",
      };
      modalRef.componentInstance.iconStatus = 'approve';
    }
    if (status === 'INACTIVE') {
      modalRef.componentInstance.info = {
        title: "Dừng hoạt động",
        content: "Bạn có muốn dừng hoạt động không ?",
      };
      modalRef.componentInstance.iconStatus = 'cancel';
    }
    
    modalRef.closed.subscribe((v) => {
      if (v) {
        this.householdService.changeStatus(Number(this.routeParams.id), status).subscribe((v) => {
          this.service.alertFlashService.success(
            ["Thay đổi trạng thái thành công"],
            this.optionsAlert
          );
          this.router.navigate(["/farm-management/household"]);
        });
      }
    });
  }

  get f() {
    return this.formGroup.controls;
  }

  get v() {
    return this.formGroup.value;
  }

  updateEvent(evt: { index: number; member: any }) {
    this.component = MemberComponent;
    this.memberIndex = evt.index;
    this.member = evt.member;
    this.show = true;
    this.ref.detectChanges();
    let toggleBtn = document.getElementById("kt_quick_custom_toggle");
    if (toggleBtn) {
      toggleBtn.click();
    }
  }

  toggleHouseholdInfor() {
    this.activeBtnPrx = "";
    this.activeBtnHh = "btn-household-infor-active";
    this.activeBtnPloF = "";
    this.activeBtnContr = "";

    this.activePrx = false;
    this.activeHh = true;
    this.activePloF = false;
    this.activeContr = false;

    this.updateBreadcrumbs();
  }

  togglePlotsOfFieldInfor() {
    this.activeBtnPrx = "";
    this.activeBtnHh = "";
    this.activeBtnPloF = "btn-plotsOfField-infor-active";
    this.activeBtnContr = "";

    this.activePrx = false;
    this.activeHh = false;
    this.activePloF = true;
    this.activeContr = false;

    this.updateBreadcrumbs();
  }

  toggleContractInfor() {
    this.activeBtnPrx = "";
    this.activeBtnHh = "";
    this.activeBtnPloF = "";
    this.activeBtnContr = "btn-contract-infor-active";

    this.activePrx = false;
    this.activeHh = false;
    this.activePloF = false;
    this.activeContr = true;

    this.updateBreadcrumbs();
  }
}
