import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '@app/modules/core/base/base.component';
import { SelectionModalComponent } from '@app/modules/core/selection-modal/selection-modal.component';
import { ComponentService } from '@app/services/component.service';
import { UsersService } from '@app/services/users.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UsersComponent } from '../list/users.component';
import { RoleModel } from '../_models/role.model';
import { UsersModel } from '../_models/users.model';
import { UploadFileService } from "@services/upload-file.service";
import { ROLES } from '@app/modules/core/utils/constants';
import { formatDate } from '@angular/common';
import { InitDataService } from '@app/services/init-data.service';
import { AddressComponent } from '@app/modules/core/reusable-components/address/address.component';

@Component({
  selector: 'edit-users',
  templateUrl: './edit-users.component.html',
  styleUrls: ['./edit-users.component.scss'],
})

export class EditUsersComponent extends BaseComponent {
  user: UsersModel;
  formGroup: FormGroup;
  roleList: RoleModel[] = [];
  validTypeFiles = ['png', 'jpg', 'jpeg'];
  typeOfHire: any;

  fields = [
    {
      name: 'Cánh đồng quảng bị',
      value: 1
    }
  ];
  ROLES = ROLES;
  initData: any = [];

  @ViewChildren(AddressComponent) addressComponents!: QueryList<AddressComponent>;

  constructor(
    public usersService: UsersService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    protected service: ComponentService,
    protected uploadFileService: UploadFileService,
    private initDataService: InitDataService,
    public ref: ChangeDetectorRef) {
    super(service);
    this.filterUserRole();
  }

  ngOnInit() {
    const id = this.routeParams['id'];
    this.service.subheaderService.updateSubBreadcrumbs(
      [
        {
          title: "Quản trị người dùng",
          linkPath: '/system-admin/users',
          linkText: 'Người quản trị',
        },
        {
          title: this.routeParams.id ? "Sửa người dùng" : "Thêm người dùng",
          linkPath: this.router.url,
          linkText: this.routeParams.id ? "Sửa người dùng" : "Thêm người dùng",
        },
      ],
      "Trang chủ",
      [
        {
          name: "Hủy",
          class: "btn btn-outline-secondary mr-2",
          url: "/system-admin/users",
        },
        {
          name: "Lưu",
          class: "btn btn-primary",
          url: "#",
          isEvent: true,
          type: 'submit',
        },
      ],
      id ? 'Chỉnh sửa người dùng' : "Thêm người dùng"
    );

    this.formGroup = this.fb.group({
      id: [],
      username: [, Validators.required],
      firstName: [, Validators.required],
      password: [, Validators.compose([Validators.minLength(6)])],
      gender: ['MALE'],
      birthday: [],
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
      email: [, Validators.email],
      phone: [],
      photo: [],
      activeStatus: ['1'],
      education: [],
      identifyCode: [, Validators.required],
      realmRoles: [[], Validators.required],
      photo_key: [''],
      photo_bucket: [''],

    });
    this.loadRole();
    this.initDataService.getInitDataHouseHold().subscribe((x: any) => {
      this.initData = x;
      this.ref.detectChanges();
    });
    if (id) {
      this.usersService.getUserById(id).subscribe(async (res: any) => {
        this.user = res;
        if (res.attributes?.photo_key) {
          const bucket = res.attributes?.photo_bucket ? res.attributes?.photo_bucket[0] : '';
          const fileName = res.attributes?.photo_key ? res.attributes?.photo_key[0] : '';
          this.uploadFileService.downloadFile(bucket, fileName).subscribe(res => {
            this.formGroup.patchValue({
              photo: res
            })
            this.ref.detectChanges();
          })

        }
        this.formGroup.patchValue({
          ...res,
          gender: res.attributes?.gender ? res.attributes?.gender[0] : 'MALE',
          birthday: (res.attributes?.birthday && res.attributes?.birthday[0]) ? formatDate(res.attributes?.birthday[0], 'yyyy-MM-dd', 'vi_VI') : '',

          permanentAddress: res.attributes?.permanentAddress ? res.attributes?.permanentAddress[0] : '',
          permanentCountryId: res.attributes?.permanentCountryId ? Number(res.attributes?.permanentCountryId[0]) : null,
          permanentProvinceId: res.attributes?.permanentProvinceId ? Number(res.attributes?.permanentProvinceId[0]) : null,
          permanentDistrictId: res.attributes?.permanentDistrictId ? Number(res.attributes?.permanentDistrictId[0]) : null,
          permanentWardId: res.attributes?.permanentWardId ? Number(res.attributes?.permanentWardId[0]) : null,

          temporaryCountryId: res.attributes?.temporaryCountryId ? Number(res.attributes?.temporaryCountryId[0]) : null,
          temporaryProvinceId: res.attributes?.temporaryProvinceId ? Number(res.attributes?.temporaryProvinceId[0]) : null,
          temporaryDistrictId: res.attributes?.temporaryDistrictId ? Number(res.attributes?.temporaryDistrictId[0]) : null,
          temporaryWardId: res.attributes?.temporaryWardId ? Number(res.attributes?.temporaryWardId[0]) : null,
          temporaryAddress: res.attributes?.temporaryAddress ? res.attributes?.temporaryAddress[0] : '',

          phone: res.attributes?.phone ? res.attributes?.phone[0] : '',
          photo: res.attributes?.photo ? res.attributes?.photo[0] : '',
          activeStatus: res.enabled ? '1' : '0',
          identifyCode: res.attributes?.identifyCode ? res.attributes?.identifyCode[0] : '',
          education: res.attributes?.education ? res.attributes?.education[0] : '',
          photo_bucket: res.attributes?.photo_bucket ? res.attributes?.photo_bucket[0] : '',
          photo_key: res.attributes?.photo_key ? res.attributes?.photo_key[0] : '',
        });
        this.ngAfterViewInit();
      });
    }

    this.subscription = this.service.subheaderService.eventEmit.subscribe(v => {
      if (v === 'submit') {
        this.onSubmit();
      }
    })
  }

  ngAfterViewInit() {
    let jokes: AddressComponent[] = this.addressComponents.toArray();
    if (this.user) {
      if (this.v.permanentCountryId) {
        jokes[0].selectAdress({
          id: this.v.permanentCountryId
        }, 0, 3)
      }
      if (this.v.permanentProvinceId) {
        jokes[0].selectAdress({
          id: this.v.permanentProvinceId
        }, 1, 3)
      }
      if (this.v.permanentDistrictId) {
        jokes[0].selectAdress({
          id: this.v.permanentDistrictId
        }, 2, 3)
      }

      if (this.v.temporaryCountryId) {
        jokes[1].selectAdress({
          id: this.v.temporaryCountryId
        }, 0, 3)
      }
      if (this.v.temporaryProvinceId) {
        jokes[1].selectAdress({
          id: this.v.temporaryProvinceId
        }, 1, 3)
      }
      if (this.v.temporaryDistrictId) {
        jokes[1].selectAdress({
          id: this.v.temporaryDistrictId
        }, 2, 3)
      }
    }
  }

  loadRole() {
    this.usersService.getUserRoles().subscribe((v: any) => {
      this.roleList = v;
    });
  }

  get f() {
    return this.formGroup.controls;
  }

  get v() {
    return this.formGroup.value;
  }

  async onSubmit() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.invalid) {
      return;
    }
    if (this.v.photo) {
      try {
        this.usersService.isLoading = true;
        const photo: any = await this.uploadFileService.uploadFile(this.v.photo[0]);
        if (photo) {
          this.formGroup.patchValue({
            photo_key: photo.key,
            photo_bucket: photo.bucket
          });
        }
      } catch (error) {
        this.usersService.isLoading = false;
        return null;
      }
    }
    let data = {
      id: this.v.id,
      username: this.v.username,
      email: this.v.email,
      enabled: Number(this.v.activeStatus) ? true : false,
      emailVerified: false,
      firstName: this.v.firstName,
      attributes: {
        gender: this.v.gender,
        birthday: this.v.birthday ? formatDate(this.v.birthday, 'dd-MM-yyyy', 'vi_VI') : '',
        permanentAddress: this.v.permanentAddress,
        temporaryAddress: this.v.temporaryAddress,
        permanentCountryId: this.v.permanentCountryId,
        permanentProvinceId: this.v.permanentProvinceId,
        permanentDistrictId: this.v.permanentDistrictId,
        permanentWardId: this.v.permanentWardId,
        temporaryCountryId: this.v.temporaryCountryId,
        temporaryProvinceId: this.v.temporaryProvinceId,
        temporaryDistrictId: this.v.temporaryDistrictId,
        temporaryWardId: this.v.temporaryWardId,
        phone: this.v.phone,
        photo_key: this.v.photo_key,
        photo_bucket: this.v.photo_bucket,
        education: this.v.education,
        identifyCode: this.v.identifyCode
      },
      credentials: null,
      realmRoles: this.v.realmRoles
    }

    if (this.v.password) {
      data.credentials = [{
        type: "password",
        value: this.v.password,
        temporary: false
      }
      ]
    }
    if (this.user) {
      this.usersService.update(data).subscribe(_ => {
        this.service.alertFlashService.success(['Cập nhật người dùng thành công'], this.optionsAlert);
        this.router.navigate(['/system-admin/users'])
      }, error => {
        this.showError(error, this.ref);
      })
    } else {
      this.usersService.create(data).subscribe(_ => {
        this.service.alertFlashService.success(['Tạo người dùng thành công'], this.optionsAlert);
        this.router.navigate(['/system-admin/users'])
      }, error => {
        this.showError(error, this.ref);
      })
    }
  }

  selectRoles(data) {
    this.formGroup.patchValue({
      realmRoles: data.map(v => v.name)
    });
    // this.userPermissions().clear();
    // data.forEach(v => {
    //   this.userPermissions().push(this.fb.group({
    //     name: [v.name],
    //     description: [v.description],
    //     fieldmanagement: [, (v.name === ROLES.QLTT || v.name === ROLES.CTT) ? Validators.required : null],
    //     typeOfHire: [, v.name === ROLES.NLC ? Validators.required : null],
    //     income: [, Validators.min(0)],
    //   }))
    // })
  }

  opendModal() {
    const modalRef = this.modalService.open(SelectionModalComponent, { size: 'xl', windowClass: 'modal-fullscreen' });
    modalRef.componentInstance.filter = { userState: 2 };
    modalRef.componentInstance.component = UsersComponent;
    modalRef.componentInstance.isSelectedOnlyItem = true;
    if (this.formGroup.value.supervisorId) {
      modalRef.componentInstance.ids = [this.formGroup.value.supervisorId];
    }
    modalRef.closed.subscribe(res => {
      this.ref.detectChanges();
    })
  }
  userPermissions(): FormArray {
    return this.formGroup.get('permissions') as FormArray
  }

  addPermission() {
    this.userPermissions().push(this.newPermission());
    this.ref.detectChanges();
  }

  newPermission() {
    return this.fb.group({
      fieldmanagement: [, Validators.compose([Validators.required])],
      typeOfHire: [, Validators.compose([Validators.required])],
      income: [],
    })
  }

  removePermission(index, roleName: string) {
    const realmRoles = this.v.realmRoles.filter(x => {
      return x !== roleName;
    });

    this.formGroup.patchValue({
      realmRoles
    })

    this.userPermissions().removeAt(index);
  }

  isControlPermissionValid(controlName: string, index: number): boolean {
    const control = ((this.formGroup.get('permissions') as FormArray).at(index) as FormGroup).controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlPermissionInValid(controlName: string, index: number): boolean {
    const control = ((this.formGroup.get('permissions') as FormArray).at(index) as FormGroup).controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlUserPermission(controlName: string, index: number) {
    return ((this.formGroup.get('permissions') as FormArray).at(index) as FormGroup).controls[controlName]
  }
}
