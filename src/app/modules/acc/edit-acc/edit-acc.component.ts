import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '@app/modules/core/base/base.component';
import { ResponseModel } from '@app/modules/core/model/response-model';
import { SelectionModalComponent } from '@app/modules/core/selection-modal/selection-modal.component';
import { ComponentService } from '@app/services/component.service';
import { ACCService } from '@app/services/acc/acc.service';
import { UploadFileService } from '@app/services/upload-file.service';
import { UsersService } from '@app/services/users.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'environments/environment';
import { UsersComponent } from '@app/modules/users/list/users.component';

@Component({
  selector: 'edit-acc',
  templateUrl: './edit-acc.component.html',
  styleUrls: ['./edit-acc.component.scss'],
})
export class EditACCComponent extends BaseComponent {
  isLoading$: any;
  formGroup: FormGroup = this.fb.group({
    id: [],
    departmentId: [, Validators.required],
    softwareId: [, Validators.required],
    typeSettingId: [, Validators.required],
    rangeSettingId: [, Validators.required],
    rangeSettingDetailId: [, Validators.required],
    ticket: [],
    typeDocumentId: [, Validators.required],
    licenseNumber: [, Validators.required],
    dateContent: [],
    contentIncorrect: [, Validators.required],
    contentCorrective: [, Validators.required],
    attachedFiles: [[]],
    accEmployees: [[], Validators.required],
    accEmployeeNames: [, Validators.required],
    AllowReadDoc: [],
    AllowPrintDoc: [],
    NotAllowReadDoc: [],
    NotAllowPrintDoc: [],
  });
  accData: any;

  actionTypes = {
    save: 1,
    submit: 2
  }

  constructor(
    private ACCService: ACCService,
    public ref: ChangeDetectorRef,
    private fb: FormBuilder,
    private usersService: UsersService,
    private modalService: NgbModal,
    private uploadFileService: UploadFileService,
    protected service: ComponentService) {
    super(service);
    this.isLoading$ = this.ACCService.isLoading$;
  }

  async ngOnInit() {
    this.service.subheaderService.updateSubBreadcrumbs([
      {
        title: 'Quản lý phiếu yêu cầu điều chỉnh dữ liệu',
        linkPath: this.router.url,
        linkText: this.routeParams.id ? 'Sửa phiếu yêu cầu điều chỉnh dữ liệu' : 'Thêm mới phiếu yêu cầu điều chỉnh dữ liệu',
      }
    ], 'Quản lý phiếu yêu cầu điều chỉnh dữ liệu');

    if (this.routeParams.id) {
    }
    this.ref.detectChanges();
  }

  get v() {
    return this.formGroup.value;
  }

  async onSubmit(actionType: number) {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.invalid) {
      return;
    }
    const data = await this.prepareData(this.formGroup.value);
    if (!data) {
      return;
    }
    data.actionType = actionType;
    if (this.accData) {
      data.id = Number(this.routeParams.id);
      this.ACCService.update(data).subscribe((res: ResponseModel) => {
        if (res.executeSuccess) {
          this.service.alertFlashService.success(['Cập nhật thành công'], this.optionsAlert);
          this.router.navigate(['/acc']);
        }
      }, error => {
        this.showError(error, this.ref);
      })
    } else {
      this.ACCService.create(data).subscribe((res: ResponseModel) => {
        if (res.executeSuccess) {
          this.service.alertFlashService.success(['Tạo thành công'], this.optionsAlert);
          this.router.navigate(['/acc']);
        }
      }, error => {
        this.showError(error, this.ref);
      })
    }
  }

  async prepareData(data: any) {
    this.ACCService.isLoading = true;
    return {
      ...data,
      dateContent: this.ACCService.formatDate(data.dateContent),
      attachedFiles: data.attachedFiles?.map(v => v.id) || null,
    };
  }

  openModal() {
    const modalRef = this.modalService.open(SelectionModalComponent, { size: 'xl', windowClass: 'modal-fullscreen' });
    modalRef.componentInstance.component = UsersComponent;
    modalRef.closed.subscribe(res => {
      if (res) {
        this.formGroup.patchValue({
          accEmployees: res.map(v => v.id),
          accEmployeeNames: res.map(v => {
            return '#' + v?.usernameFull
          }).join(', '),
        });
        this.ref.detectChanges();
      }
    });
  }

  getCorrective(event: string) {
    this.formGroup.patchValue({
      contentCorrective: event
    });
  }

  getInCorrective(event: string) {
    this.formGroup.patchValue({
      contentIncorrect: event
    });
  }
}
