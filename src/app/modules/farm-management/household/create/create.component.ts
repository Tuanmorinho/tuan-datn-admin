import { formatDate } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { BaseComponent } from "@app/modules/core/base/base.component";
import { ColumnConfig } from "@app/modules/core/table/_models/column.config";
import { ComponentService } from "@app/services/component.service";
import { HouseholdService } from "@app/services/household.service";
import { InitDataService } from "@app/services/init-data.service";
import { UploadFileService } from "@app/services/upload-file.service";
import { MemberComponent } from '../components/member-component/member-component.component';
import { OffcanvasService } from '@app/services/offcanvas.service';
import KTLayoutQuickCustom from '../../../../../assets/js/layout/extended/quick-custom';
import { KTUtil } from '../../../../../assets/js/components/util';
@Component({
  selector: "app-household-create",
  templateUrl: "./create.component.html",
  styleUrls: ["./create.component.scss"],
})
export class HouseHoldCreateComponent extends BaseComponent {
  validTypeFiles = ["png", "jpg", "jpeg"];

  initData: any = [];
  memebers = [];
  ownerData: any;
  component:any = MemberComponent;
  memberIndex: number  = -1;
  member: any;

  formGroup: FormGroup = this.fb.group({
    id: [],
    registrationBookCode: [, Validators.required],
    fullname: [, Validators.required],
    gender: ['MALE', Validators.required],
    birthday: [, Validators.required],
    email: [],
    phone: [],
    relationship: [, Validators.required],
    marriageState: ['SINGLE'],
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
    bankAccounts: this.fb.array([]),
    role: ['OWNER'],
    identifyType: ['CCCD']
  });

  loading$: any;

  constructor(
    private fb: FormBuilder,
    protected service: ComponentService,
    private householdService: HouseholdService,
    private initDataService: InitDataService,
    public ref: ChangeDetectorRef,
    private offcanvasService: OffcanvasService,
    private uploadService: UploadFileService
  ) {
    super(service);
    this.loading$ = householdService.isLoading$;
  }

  ngOnInit() {
    this.formGroup.addControl('isRegisted', new FormControl(false));
    this.formGroup.addControl('userId', new FormControl(null));
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
      [
        {
          name: "Hủy",
          class: "btn btn-outline-secondary mr-2",
          url: "/farm-management/household",
        },
        {
          name: "Lưu",
          class: "btn btn-primary",
          url: "#",
          isEvent: true,
          type: 'submit',
        },
      ],
      "Thêm thông tin hộ gia đình"
    );

    this.subscription = this.service.subheaderService.eventEmit.subscribe(v => {
      if (v === 'submit') {
        this.onSubmit();
      }
    })

    this.initDataService.getInitDataHouseHold().subscribe((x: any) => {
      this.initData = x;
      this.ref.detectChanges();
    });

    if (this.routeParams.id) {
      this.householdService.getItemById(Number(this.routeParams.id)).subscribe((v: any) => {
        this.ownerData = v.members.find(v1 => v1.role === 'OWNER');
        this.formGroup.patchValue({
          registrationBookCode: v?.registrationBookCode,
          ...this.ownerData,
          birthday: this.ownerData?.birthday ? formatDate(this.ownerData?.birthday, 'yyyy-MM-dd', 'vi_VI') : null,
          permanentCountryId: this.ownerData?.permanentCountry.id,
          permanentProvinceId: this.ownerData?.permanentProvince.id,
          permanentDistrictId: this.ownerData?.permanentDistrict.id,
          permanentWardId: this.ownerData?.permanentWard.id,
          temporaryCountryId: this.ownerData?.temporaryCountry?.id,
          temporaryProvinceId: this.ownerData?.temporaryProvince?.id,
          temporaryDistrictId: this.ownerData?.temporaryDistrict?.id,
          temporaryWardId: this.ownerData?.temporaryWard?.id,
        });
        this.memebers = v.members.filter(v1 => v1.role === 'MEMBER');
        this.ref.detectChanges();
      })
    }

    if(this.memberIndex !== -1){
      this.filter = this.member;  
    } else {
      this.filter = {
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
    }
   
  }

  ngAfterViewInit(){
    KTUtil.ready(() => {
      if (true) {
        KTLayoutQuickCustom.init('kt_quick_custom');
      }
    });

    this.offcanvasService.closeValue$.subscribe(res => {
      if (this.memberIndex != -1) {
        this.memebers[this.memberIndex] = {
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
      this.memberIndex = -1;
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
    this.filter = {
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
  }

  updateEvent(data: any) {
    this.memberIndex = data.index;
    this.member = data.member;
    document.getElementById('kt_quick_custom_toggle').click();
    this.filter = this.member;  
  }

  deleteEvent(data: any) {
    this.memebers.splice(data.index, 1);
  }

  async onSubmit() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.invalid) {
      return;
    }

    this.householdService.isLoading = true;
    if (this.v.avatar) {
      try {
        const avatar = await this.uploadService.uploadFile(this.v.avatar[0]);
        if (avatar) {
          this.formGroup.patchValue({ avatar })
        }
      } catch (_) {
        this.householdService.isLoading = false;
      }
    }

    try {
      for (const item of this.memebers) {
        if (item.avatar) {
          const avatar = await this.uploadService.uploadFile(item.avatar[0]);
          if (avatar) {
            item.avatar = avatar
          }
        }
      }
    } catch (_) {
      this.householdService.isLoading = false;
    }

    const memebers = JSON.parse(JSON.stringify(this.memebers));
    const owner = JSON.parse(JSON.stringify(this.v));
    for (const item of memebers) {
      Object.keys(item).forEach(key => {
        if (item[key] === null) {
          delete item[key];
        }
      });
    }
    Object.keys(owner).forEach(key => {
      if (owner[key] === null) {
        delete owner[key];
      }
    });

    const data = {
      registrationBookCode: this.v.registrationBookCode,
      members: [owner, ...memebers]
    }

    this.householdService.create(data).subscribe(v => {
      this.service.alertFlashService.success(['Tạo hộ gia đình thành công'], this.optionsAlert);
      this.service.router.navigate(['/farm-management/household']);
    }, error => this.showError(error, this.ref))
  }
}
