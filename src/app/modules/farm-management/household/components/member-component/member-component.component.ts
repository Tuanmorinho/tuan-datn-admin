import { BaseComponent } from '@app/modules/core/base/base.component';
import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentService } from '@app/services/component.service';
import { HouseholdService } from '@app/services/household.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { InitDataService } from '@app/services/init-data.service';
import { UploadFileService } from '@app/services/upload-file.service';
import { OffcanvasService } from '@app/services/offcanvas.service';

@Component({
  selector: 'app-member-component',
  templateUrl: './member-component.component.html',
  styleUrls: ['./member-component.component.scss']
})
export class MemberComponent extends BaseComponent {
  initData: any;
  @Output() memberDetail = new EventEmitter();

  validTypeFiles = ["png", "jpg", "jpeg"];

  formGroup: FormGroup = this.fb.group({
    id: [],
    fullname: [, Validators.required],
    relationship: [, Validators.required],
    marriageState: ['SINGLE'],
    gender: ['MALE', Validators.required],
    birthday: [, Validators.required],
    email: [],
    phone: [],
    identifyCode: [, Validators.required],
    avatar: [],
    education: [],
    occupation: [],
    monthlyIncome: [, Validators.min(0)],
    permanentAddress: [, Validators.required],
    permanentCountryId: [, Validators.required],
    permanentProvinceId: [, Validators.required],
    permanentDistrictId: [, Validators.required],
    permanentWardId: [, Validators.required],
    temporaryAddress: [],
    temporaryCountryId: [],
    temporaryProvinceId: [],
    temporaryDistrictId: [],
    temporaryWardId: [],
    role: [],
    identifyType: [],
    bankAccounts: this.fb.array([])
  });

  constructor(
    protected service: ComponentService,
    private fb: FormBuilder,
    private initDataService: InitDataService,
    public ref: ChangeDetectorRef,
    public modalService: NgbActiveModal,
    private uploadFileService: UploadFileService,
    private houseHoldService: HouseholdService,
    public offcanvasService: OffcanvasService,
  ) {
    super(service);
  }

  ngOnInit(): void {
    this.formGroup.addControl('isRegisted', new FormControl(false));
    this.formGroup.addControl('userId', new FormControl(null));

    if (this.filter) {
      this.formGroup.patchValue({
        ...this.filter,
        permanentCountryId: this.filter?.permanentCountry?.id,
        permanentProvinceId: this.filter?.permanentProvince?.id,
        permanentDistrictId: this.filter?.permanentDistrict?.id,
        permanentWardId: this.filter?.permanentWard?.id,
        temporaryCountryId: this.filter?.temporaryCountry?.id,
        temporaryProvinceId: this.filter?.temporaryProvince?.id,
        temporaryDistrictId: this.filter?.temporaryDistrict?.id,
        temporaryWardId: this.filter?.temporaryWard?.id,
      }); 
      this.ref.detectChanges();
    }
    this.initDataService.getInitDataHouseHold().subscribe((x: any) => {
      this.initData = x;
      this.ref.detectChanges();
    });
  }

  get v() {
    return this.formGroup.value;
  }

  async onSubmit() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.invalid) {
      return;
    }
    if (this.filter?.isEdit) {
      if (this.v.avatar) {
        try {
          const avatar = await this.uploadFileService.uploadFile(this.v.avatar[0]);
          if (avatar) {
            this.formGroup.patchValue({ avatar })
          }
        } catch (_) {
          this.houseHoldService.isLoading = false;
        }
      }
      const member = JSON.parse(JSON.stringify(this.v));
      delete member.photo;
      if (this.formGroup.value.id) {
        // update memeber
        this.houseHoldService.updateMemberInfo(member, this.routeParams.id).subscribe(_ => {
          this.service.alertFlashService.success(['Cập nhật thành viên thành công'], this.optionsAlert);
          this.closeOffCanvas()
        }, err => {
          this.showError(err, this.ref)
        });
      } else {
        // create new member
        this.houseHoldService.createMemberInfo(member, this.routeParams.id).subscribe((res: any) => {
          this.service.alertFlashService.success(['Thêm thành viên thành công'], this.optionsAlert);
          this.formGroup.patchValue({
            id: res.id
          });
          this.closeOffCanvas()
        }, err => {
          this.showError(err, this.ref)
        });
      }
    } else {
      this.offcanvasService.closeValue = this.formGroup.value;
    }
  }

  closeOffCanvas() {
    this.offcanvasService.closeValue = this.formGroup.value;
    let toggleBtn = document.getElementById("kt_quick_custom_close");
    if (toggleBtn) {
      toggleBtn.click();
    }
  }
}

