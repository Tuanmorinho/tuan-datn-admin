import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '@app/modules/auth';
import { BaseComponent } from '@app/modules/core/base/base.component';
import { ASSIGNEE } from '@app/modules/core/utils/assignee';
import { addDays } from '@app/modules/core/utils/helpers';
import { ComponentService } from '@app/services/component.service';
import { UploadFileService } from '@app/services/upload-file.service';
import { UsersService } from '@app/services/users.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-detail-document',
  templateUrl: './detail-document.component.html',
  styleUrls: ['./detail-document.component.scss']
})
export class DetailDocumentComponent extends BaseComponent {
  isLoading$;
  listUsers: any[];
  listDepartments: any[] = [];
  listPositionLevels: any[] = [];
  listPositions: any[];
  departmentList: [];
  documentTypeList: [];

  document: any;

  formGroup = this.fb.group({
    commentId: [],
    comment: [, Validators.required],
    attachedFiles: [],
    files: [[]]
  });
  constructor(
    protected service: ComponentService,
    private usersService: UsersService,
    public modalRef: NgbModal,
    public modal: NgbActiveModal,
    private fb: FormBuilder,
    public ref: ChangeDetectorRef,
    protected authService: AuthService,
    protected uploadFileService: UploadFileService,
  ) {
    super(service)
  }

  async ngOnInit() {
    this.service.subheaderService.updateBreadcrumbs([
      {
        title: 'Hệ thống tài liệu',
        linkPath: '/document/list',
        linkText: 'Hệ thống tài liệu',
      },
      {
        title: 'Hệ thống tài liệu',
        linkPath: this.router.url,
        linkText: 'Chi tiết tài liệu',
      }
    ], 'Hệ thống tài liệu');
    
    this.loadDocument();
  }

  getContentEditor(e) {
    this.formGroup.patchValue({
      comment: e
    });
  }

  loadDocument() {
    const id = this.routeParams['id'];
    if (id) {
    }
  }

  checkAuthor() {
    
    return false;
  }

  onBack() {
    this.router.navigate(['/document/list']);
  }
}
