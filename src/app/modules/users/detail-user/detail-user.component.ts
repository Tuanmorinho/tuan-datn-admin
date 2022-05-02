import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseComponent } from '@app/modules/core/base/base.component';
import { DeleteModalComponent } from '@app/modules/core/delete-modal/delete-modal.component';
import { ComponentService } from '@app/services/component.service';
import { UploadFileService } from '@app/services/upload-file.service';
import { UsersService } from '@app/services/users.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UsersModel } from '../_models/users.model';

@Component({
  selector: 'app-detail-user',
  templateUrl: './detail-user.component.html',
  styleUrls: ['./detail-user.component.scss']
})
export class DetailUserComponent extends BaseComponent {

  user: any=[];
  idParam: any;

  activeBtnPr: string = 'btn-product-infor-active';
  activeBtnMn: string = '';
  activePrForm: boolean = true;
  activeMnForm: boolean = false;
  formGroup: FormGroup;

  imageUrl: any = "./assets/media/svg/icons/Common/Group.svg";
  constructor(
    protected service: ComponentService,
    public userService: UsersService,
    private fb: FormBuilder,
    protected uploadFileService: UploadFileService,
    public ref: ChangeDetectorRef,
    private modalService: NgbModal

  ) {
    super(service);
  }

  ngOnInit(): void {
    this.idParam = this.routeParams.id;
    this.service.subheaderService.updateBreadcrumbs([
      {
        title: 'Quản trị người dùng',
        linkPath: '/system-admin/users/list',
        linkText: 'Nhân viên',
      },
      {
        title: 'Chi tiết người dùng',
        linkPath: 'system-admin/users/list',
        linkText: 'Nhân viên',
      }
    ], 'Trang chủ',
    [
      {
        name: 'Thoát',
        url: '/system-admin/users/list',
        class: 'btn btn-outline-dark get-data btn-elevate mr-3'
      },
      {
        name: 'Xóa',
        url: '#',
        class: 'btn btn-primary btn-outline-danger get-data btn-elevate mr-3',
        type: 'delete',
        isEvent: true
      },
      {
        name: 'Chỉnh sửa',
        url: '/system-admin/users/edit/' + this.idParam,
        class: 'btn btn-primary get-data btn-elevate',
      }
    ], 'Chi tiết người dùng');
    this.subscription = this.service.subheaderService.eventEmit
    .subscribe(v => {
      if (v === 'delete') {
        this.deleteUser()
      }
    });
    this.userService.getUserById(this.routeParams.id).subscribe((v: any) => {
      this.user = v;
      if (v.attributes?.photo_key) {
        const bucket = v.attributes?.photo_bucket ? v.attributes?.photo_bucket[0] : '';
        const fileName = v.attributes?.photo_key ? v.attributes?.photo_key[0] : '';
        this.uploadFileService.downloadFile(bucket, fileName).subscribe(v => {
          if (v) {
            this.imageUrl = v;
            this.ref.detectChanges();
          }
        })
      }
    });
  }

  deleteUser() {
    const modalRef = this.modalService.open(DeleteModalComponent, { centered: true });
    modalRef.componentInstance.info = {
      title: 'Xóa người dùng',
      content: 'Bạn có muốn xóa người dùng '
    };
    modalRef.componentInstance.ids = Number(this.idParam);
    modalRef.componentInstance.bgColor = '#F64E60';
    modalRef.componentInstance.baseService = this.userService;

    modalRef.closed.subscribe(v => {
      if (v) {
        if (v.error) {
          this.showError(v.error, this.ref);
        }
        this.router.navigate(['/system-admin/users/list']);
      }
    });
  }

  get f() {
    return this.formGroup.controls;
  }

  get v() {
    return this.formGroup.value;
  }

  toggleProductInf() {
    this.activeBtnPr = 'btn-product-infor-active';
    this.activeBtnMn = '';
    this.activePrForm = true;
    this.activeMnForm = false;
  }

  toggleManual() {
    this.activeBtnPr = '';
    this.activeBtnMn = 'btn-manual-active';
    this.activePrForm = false;
    this.activeMnForm = true;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
