import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@app/modules/auth';
import { BaseComponent } from '@app/modules/core/base/base.component';
import { ASSIGNEE } from '@app/modules/core/utils/assignee';
import { ComponentService } from '@app/services/component.service';
import { ACCService } from '@app/services/acc/acc.service';
import { UsersService } from '@app/services/users.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'environments/environment';
import { UploadFileService } from '@app/services/upload-file.service';
import { ResponseModel } from '@app/modules/core/model/response-model';

@Component({
  selector: 'app-detail-acc',
  templateUrl: './detail-acc.component.html',
  styleUrls: ['./detail-acc.component.scss'],
})
export class DetailACCComponent extends BaseComponent {
  isLoading$;
  listUsers: any[];
  listDepartments: any[] = [];
  listPositionLevels: any[] = [];
  listPositions: any[];
  departmentList: [];
  accData: any;

  formGroup: FormGroup =  this.fb.group({
    id: [],
    accId: Number(this.routeParams.id),
    content: [, Validators.required],
    startDate: [new Date(), Validators.required],
    attachedFiles: [[]],    
  });

  constructor(
    protected service: ComponentService,
    public ACCService: ACCService,
    public usersService: UsersService,
    public modalRef: NgbModal,
    public modal: NgbActiveModal,
    public ref: ChangeDetectorRef,
    protected authService: AuthService,
    private fb: FormBuilder,
    private uploadFileService: UploadFileService
  ) {
    super(service)
    this.isLoading$ = this.ACCService.isLoading$;
  }

  async ngOnInit() {
    this.service.subheaderService.updateBreadcrumbs([
      {
        title: 'Quản lý phiếu yêu cầu điều chỉnh dữ liệu',
        linkPath: '/acc/list',
        linkText: 'Quản lý phiếu yêu cầu điều chỉnh dữ liệu',
      },
      {
        title: 'Quản lý phiếu yêu cầu điều chỉnh dữ liệu',
        linkPath: this.router.url,
        linkText: 'Chi tiết phiếu yêu cầu điều chỉnh dữ liệu',
      }
    ], 'Quản lý phiếu yêu cầu điều chỉnh dữ liệu');

    this.ACCService.checkSubmitDetail().subscribe(v => {
      if (v) {
        this.formGroup.markAllAsTouched();
        if (this.formGroup.invalid) {
          this.ACCService.onSubmitDetail(false);
        } else {
          this.ACCService.onSubmitDetail(true);
        }
      }
    });
    this.ACCService.submitDetail().subscribe(v => {
      if (v) {
        this.onSaveActualResult(true);
      }
    });

    await this.loadData();
  }

  async loadData() {
    const id = this.routeParams['id'];
    if (id) {
      // get Detail
      this.ACCService.getItemById(id).subscribe((res: any) => {
        
      }, error => {
        this.service.authorizeService.isAuthorizedToAccessThis(error)
        this.router.navigate(['/acc']);
      });
    }
  }

  checkAuthor() {    
    return false;
  }

  async onSaveActualResult(fromComment = false) {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.invalid) {
      return;
    }
    const data = await this.prepareData(this.formGroup.value);
    this.ACCService.actualresult(data).subscribe((res: ResponseModel) => {
      if (res.executeSuccess) {
        this.formGroup.patchValue({
          id: res.data.id
        });
        if (!fromComment) {
          this.service.alertFlashService.success(['Báo cáo thực hiện thành công'], this.optionsAlert);
          this.ref.detectChanges();
        }
      }
    }, error => {
      this.showError(error, this.ref);
    })
  }

  async prepareData(data) {
    this.ACCService.isLoading = true;
    try {
    } catch (error) {
      this.showError(error, this.ref);
      this.ACCService.isLoading = false;
      return null;
    }

    return {
      ...data,
      startDate: this.ACCService.formatDate(data.startDate),
      attachedFiles: data.attachedFiles?.map(v => v.id) || null,
    };
  }

  getAssignee(assignee) {
    if (assignee === 7) {
      this.loadData();
    }
  }
}
