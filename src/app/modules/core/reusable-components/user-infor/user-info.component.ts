import { formatDate } from "@angular/common";
import { AfterViewInit, ChangeDetectorRef, Component, forwardRef, Input, OnChanges, QueryList, SimpleChanges, ViewChildren } from "@angular/core";
import { ControlValueAccessor, FormArray, FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from "@angular/forms";
import { BaseComponent } from '@app/modules/core/base/base.component';
import { ComponentService } from "@app/services/component.service";
import { HouseholdService } from "@app/services/household.service";
import { UploadFileService } from "@app/services/upload-file.service";
import { UsersService } from "@app/services/users.service";
import { RELATIONSHIPS } from "../../utils/constants";
import { AddressComponent } from "../address/address.component";

@Component({
  selector: "user-info",
  templateUrl: "./user-info.component.html",
  styleUrls: ["./user-info.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UserInfoComponent),
      multi: true,
    },
  ],
})
export class UserInfoComponent extends BaseComponent implements ControlValueAccessor, OnChanges, AfterViewInit {
  @Input() formGroup: FormGroup;
  @Input() validTypeFiles: string[];
  @Input() initData: any;
  @Input() ownerData: any;
  @Input() isOwner: boolean = false;
  @Input() isMember: boolean = false;

  relationships = RELATIONSHIPS;

  users = [];

  @ViewChildren(AddressComponent) addressComponents!: QueryList<AddressComponent>;
  constructor(
    private fb: FormBuilder,
    protected service: ComponentService,
    private uploadFileService: UploadFileService,
    private userService: UsersService,
    private houseHoldService: HouseholdService,
    public ref: ChangeDetectorRef
  ) {
    super(service);
  }

  ngOnInit() {
    this.houseHoldService.getListUsers().subscribe((v: any[]) => {
      this.users = v;
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.ownerData && changes.ownerData.currentValue != changes.ownerData.previousValue) {
      changes.ownerData.currentValue?.bankAccounts?.forEach(v => {
        this.userBanks().push(this.fb.group({
          id: [v?.id],
          number: [v.number, Validators.compose([Validators.required])],
          name: [v.name, Validators.compose([Validators.required])],
          bankId: [v.bank?.id, Validators.required],
          bank: [v.bank],
        }));
      });
      if (this.ownerData.avatar?.key) {
        const bucket = this.ownerData.avatar?.bucket ? this.ownerData.avatar?.bucket : '';
        const fileName = this.ownerData.avatar?.key ? this.ownerData.avatar?.key : '';
        this.uploadFileService.downloadFile(bucket, fileName).subscribe(v => {
          if (v) {
            this.formGroup.addControl('photo', new FormControl(v));
          }
        })
      }
      if (this.ownerData.userId) {
        this.formGroup.patchValue({
          isRegisted: true
        });
        this.ref.detectChanges();
      }
    }
  }
  onChange(event) {}

  onTouched() {}

  writeValue(files: any): void {}

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  ngAfterViewInit() {
    let jokes: AddressComponent[] = this.addressComponents ? this.addressComponents.toArray() : [];
    if (this.ownerData && jokes.length) {
      if (this.ownerData.permanentCountry) {
        jokes[0].selectAdress(this.ownerData.permanentCountry, 0, 0)
      }
      if (this.ownerData.permanentProvince) {
        jokes[0].selectAdress(this.ownerData.permanentProvince, 1, 0)
      }
      if (this.ownerData.permanentDistrict) {
        jokes[0].selectAdress(this.ownerData.permanentDistrict, 2, 0)
      }
      if (this.ownerData.permanentWard) {
        jokes[0].selectAdress(this.ownerData.permanentWard, 3, 0)
      }

      if (this.ownerData.temporaryCountry) {
        jokes[1].selectAdress(this.ownerData.temporaryCountry, 0, 1)
      }
      if (this.ownerData.temporaryProvince) {
        jokes[1].selectAdress(this.ownerData.temporaryProvince, 1, 1)
      }
      if (this.ownerData.temporaryDistrict) {
        jokes[1].selectAdress(this.ownerData.temporaryDistrict, 2, 1)
      }
      if (this.ownerData.temporaryWard) {
        jokes[1].selectAdress(this.ownerData.temporaryWard, 3, 1)
      }
    }
  }

  selectUser(data) {
    if (data) {
      this.userService.getUserById(data.id).subscribe((user: any) => {
        this.formGroup.patchValue({
          email: user?.email,
          fullname: user?.firstName,
          gender: user.attributes?.gender ? user.attributes?.gender[0] : 'MALE',
          birthday: (user.attributes?.birthday && user.attributes?.birthday[0]) ? formatDate(user.attributes?.birthday[0], 'yyyy-MM-dd', 'vi_VI') : '',
          
          permanentAddress: user.attributes?.permanentAddress ? user.attributes?.permanentAddress[0] : '',
          permanentCountryId: user.attributes?.permanentCountryId ? Number(user.attributes?.permanentCountryId[0]) : null,
          permanentProvinceId: user.attributes?.permanentProvinceId ? Number(user.attributes?.permanentProvinceId[0]) : null,
          permanentDistrictId: user.attributes?.permanentDistrictId ? Number(user.attributes?.permanentDistrictId[0]) : null,
          permanentWardId: user.attributes?.permanentWardId ? Number(user.attributes?.permanentWardId[0]) : null,
  
          temporaryCountryId: user.attributes?.temporaryCountryId ? Number(user.attributes?.temporaryCountryId[0]) : null,
          temporaryProvinceId: user.attributes?.temporaryProvinceId ? Number(user.attributes?.temporaryProvinceId[0]) : null,
          temporaryDistrictId: user.attributes?.temporaryDistrictId ? Number(user.attributes?.temporaryDistrictId[0]) : null,
          temporaryWardId: user.attributes?.temporaryWardId ? Number(user.attributes?.temporaryWardId[0]) : null,
          temporaryAddress: user.attributes?.temporaryAddress ? user.attributes?.temporaryAddress[0] : '',
          
          phone: user.attributes?.phone ? user.attributes?.phone[0] : '',
          photo: user.attributes?.photo ? user.attributes?.photo[0] : '',
          activeStatus: user.enabled ? '1' : '0',
          identifyCode: user.attributes?.identifyCode ? user.attributes?.identifyCode[0] : '',
          education: user.attributes?.education ? user.attributes?.education[0] : '',
          photo_bucket: user.attributes?.photo_bucket ? user.attributes?.photo_bucket[0] : '',
          photo_key: user.attributes?.photo_key ? user.attributes?.photo_key[0] : '',
        });
        this.ngAfterViewInit2(user);
      })
    }
  }

  get v() {
    return this.formGroup.value;
  }

  ngAfterViewInit2(user) {
    let jokes: AddressComponent[] = this.addressComponents.toArray();
    if (user) {
      if (this.v.permanentCountryId) {
        jokes[0].selectAdress({
          id: this.v.permanentCountryId
        }, 0, 0)
      }
      if (this.v.permanentProvinceId) {
        jokes[0].selectAdress({
          id: this.v.permanentProvinceId
        }, 1, 0)
      }
      if (this.v.permanentDistrictId) {
        jokes[0].selectAdress({
          id: this.v.permanentDistrictId
        }, 2, 0)
      }

      if (this.v.temporaryCountryId) {
        jokes[1].selectAdress({
          id: this.v.temporaryCountryId
        }, 0, 1)
      }
      
      if (this.v.temporaryProvinceId) {
        jokes[1].selectAdress({
          id: this.v.temporaryProvinceId
        }, 1, 1)
      }
      if (this.v.temporaryDistrictId) {
        jokes[1].selectAdress({
          id: this.v.temporaryDistrictId
        }, 2, 1)
      }
    }
  }


  userBanks(): FormArray {
    return this.formGroup.get('bankAccounts') as FormArray
  }

  addBank() {
    this.userBanks().push(this.newBank());
  }

  newBank() {
    return this.fb.group({
      id: [],
      number: [, Validators.compose([Validators.required])],
      name: [, Validators.compose([Validators.required])],
      bankId: [, Validators.required],
    })
  }

  removeBank(index: number) {
    this.userBanks().removeAt(index);
  }

  isControlBankValid(controlName: string, index: number): boolean {
    const control = ((this.formGroup.get('bankAccounts') as FormArray).at(index) as FormGroup).controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlBankInValid(controlName: string, index: number): boolean {
    const control = ((this.formGroup.get('bankAccounts') as FormArray).at(index) as FormGroup).controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlBank(controlName: string, index: number) {
    return ((this.formGroup.get('bankAccounts') as FormArray).at(index) as FormGroup).controls[controlName]
  }
}
