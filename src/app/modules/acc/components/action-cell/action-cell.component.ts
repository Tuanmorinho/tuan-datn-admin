import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { AuthService } from '@app/modules/auth';
import { BaseComponent } from '@app/modules/core/base/base.component';
import { DeleteModalComponent } from '@app/modules/core/delete-modal/delete-modal.component';
import { ASSIGNEE } from '@app/modules/core/utils/assignee';
import { DocumentModel } from '@app/modules/document/_models/document.model';
import { ACCService } from '@app/services/acc/acc.service';
import { ComponentService } from '@app/services/component.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-meeting-revision-action-cell',
  templateUrl: './action-cell.component.html',
  styleUrls: ['./action-cell.component.scss']
})
export class ActionCellComponent extends BaseComponent {
  type = 1;
  @Input() prop: any;
  constructor(
    private modalService: NgbModal,
    public ref: ChangeDetectorRef,
    protected authService: AuthService,
    protected service: ComponentService,
    private ACCService: ACCService
  ) {
    super(service);
  }

  ngOnInit(): void {    
  }

  checkAuthor() {
    const currentUser = this.authService.currentUserValue;
    if (currentUser.roleId === 1) {
      return true;
    }
    return false;
  }

  edit(prop) {
    this.router.navigate(['/acc/edit/' + prop.id]);
  }

  delete(document: DocumentModel) {
    const modalRef = this.modalService.open(DeleteModalComponent,{ centered: true});
    modalRef.componentInstance.info = {
      title: 'Xóa yêu cầu',
      content: 'Bạn có muốn xóa yêu cầu này?'
    };
    modalRef.componentInstance.bgColor = '#F64E60';
    modalRef.componentInstance.ids = [document.id];
    modalRef.componentInstance.baseService = this.ACCService;
    modalRef.closed.subscribe(v => {
      if (v.error) {
        this.showError(v.error, this.ref);
      } else {
        this.ACCService.fetch();
      }
      window.scrollTo(0, 0);
    });
  }

}
