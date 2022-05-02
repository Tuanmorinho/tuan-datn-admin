import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { AuthService } from '@app/modules/auth';
import { BaseComponent } from '@app/modules/core/base/base.component';
import { ConfirmModalComponent } from '@app/modules/core/confirm-modal/confirm-modal.component';
import { DeleteModalComponent } from '@app/modules/core/delete-modal/delete-modal.component';
import { ComponentService } from '@app/services/component.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'environments/environment.prod';
import { Subscription } from 'rxjs';
import { DocumentModel } from '../../_models/document.model';

@Component({
  selector: 'app-action-cell',
  templateUrl: './action-cell.component.html',
  styleUrls: ['./action-cell.component.scss']
})
export class ActionCellComponent extends BaseComponent{

  @Input() prop: any;
  subscription: Subscription;
  isLoading$: any;
  constructor(
    private modalService: NgbModal,
    public ref: ChangeDetectorRef,
    protected authService: AuthService,
    protected service: ComponentService
  ) {
    super(service);
  }

  ngOnInit(): void {
  }

  publishDocument(document: DocumentModel) {
    const modalRef = this.modalService.open(ConfirmModalComponent,{centered:true});
    let isPublish = true;
    if (document.reviewStatus === 4) {
      modalRef.componentInstance.info = {
        title: 'Hủy Publish tài liệu ',
        content: `Bạn có muốn Hủy Publish tài liệu ${document.name} ?`
      };
      isPublish = false;
    } else {
      modalRef.componentInstance.info = {
        title: 'Cập nhật trạng thái Publish đến CBNV tài liệu ',
        content: `Bạn có muốn Publish đến CBNV tài liệu ${document.name} ?`
      };
    }
    modalRef.closed.subscribe(v => {
      if (v) {
        
      }
      window.scrollTo(0, 0);
      this.ref.detectChanges();
    });
  }

  delete(document: DocumentModel) {
    const modalRef = this.modalService.open(DeleteModalComponent,{ centered: true});
    modalRef.componentInstance.info = {
      title: 'Xóa tài liệu',
      content: 'Bạn có muốn xóa tài liệu ' + document.name
    };
    modalRef.componentInstance.bgColor = '#F64E60';
    modalRef.componentInstance.ids = [document.id];
    // modalRef.componentInstance.baseService = this.documentService;
    modalRef.closed.subscribe(v => {
      if (v.error) {
        this.showError(v.error, this.ref);
      } else {
        // this.documentService.fetch();
      }
      window.scrollTo(0, 0);
    });
  }
}
