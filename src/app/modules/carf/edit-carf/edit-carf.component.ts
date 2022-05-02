import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '@app/modules/core/base/base.component';
import { ComponentService } from '@app/services/component.service';
import { UploadFileService } from '@app/services/upload-file.service';
import { UsersService } from '@app/services/users.service';

@Component({
  selector: 'edit-carf',
  templateUrl: './edit-carf.component.html',
  styleUrls: ['./edit-carf.component.scss'],
})
export class EditCarfComponent extends BaseComponent {
  isLoading$: any;
  formGroup: FormGroup = this.fb.group({});
  correctiveAuditData: any;
  constructor(
    public ref: ChangeDetectorRef,
    private fb: FormBuilder,
    private uploadFileService: UploadFileService,
    private usersService: UsersService,
    protected service: ComponentService) {
    super(service);
  }

  async ngOnInit() {
    this.service.subheaderService.updateSubBreadcrumbs([
      {
        title: 'Khắc phục phòng ngừa',
        linkPath: this.router.url,
        linkText: this.routeParams.id ? 'Sửa khắc phục phòng ngừa' : 'Thêm mới khắc phục phòng ngừa',
      }
    ], 'Khắc phục phòng ngừa');
    
    if (this.routeParams.id) {
      
    }
    this.ref.detectChanges();
  }

  selectCarfFnId(event) {
    if (event === 4) {
      if (!this.reviewProcesses.find(v => v.name === 'Executor')) {
        this.reviewProcesses.push({
          displayName: "Bộ phận tiếp đoàn",
          index: 9,
          isExecutor: true,
          isRequired: true,
          name: "Executor"
        });
        this.formGroup.addControl('Executor', new FormControl('', Validators.required));
        this.ref.detectChanges();
      }
    } else {
      this.reviewProcesses = this.reviewProcesses.filter(v => v.name != 'Executor');
      this.formGroup.removeControl('Executor');
    }
  }

  async onSubmit(actionType: number) {
    this.formGroup.markAllAsTouched();
    this.ref.detectChanges();
    if (this.formGroup.invalid) {
      return;
    }
    const data = await this.prepareData({...this.formGroup.value });
    data.startDateAudit = data.DateTimeAudit[0];
    data.endDateAudit = data.DateTimeAudit[1];
    data.actionType = actionType;
    if (!data) {
      return;
    }
    if (this.correctiveAuditData) {
      data.id = Number(this.routeParams.id);
      
    } else {
      
    }
  }

  async prepareData(data: any) {
    try {
      // data.files = await this.uploadFileService.uploadFile(data.files || [], data.folderPath);
      let correctiveActionReportDetails = [];
      for (const item of data.correctiveActionReportDetails) {
        // item.files = await this.uploadFileService.uploadFile(
        //   item.files || [],
        //   data.folderPath
        // );
        correctiveActionReportDetails.push({
          ...item,
          files: item.files?.map(v1 => v1.id) || null,
          auditStandardDetailId: Number(item.auditStandardDetailId)
        });
      }
      data.carfType = Number(data.carfType);
      data.carfncType = Number(data.carfncType);
      return {
        ...data,
        files: data.files?.map(v => v.id) || null,
        correctiveActionReportDetails
      };
    } catch (error) {
      this.showError(error, this.ref);
      return;
    }
  } 
}
