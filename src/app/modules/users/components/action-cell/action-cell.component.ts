import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from '@app/modules/core/base/base.component';
import { DeleteModalComponent } from '@app/modules/core/delete-modal/delete-modal.component';
import { ComponentService } from '@app/services/component.service';
import { UsersService } from '@app/services/users.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UsersModel } from '../../_models/users.model';

@Component({
  selector: 'app-action-cell',
  templateUrl: './action-cell.component.html',
  styleUrls: ['./action-cell.component.scss']
})
export class ActionCellComponent extends BaseComponent {

  @Input() prop: UsersModel;
  constructor(
    protected service: ComponentService,
    public usersService: UsersService,
    private modalService: NgbModal,
    public ref: ChangeDetectorRef,
  ) {
    super(service);
  }

  ngOnInit(): void {
  }

  delete(user: UsersModel) {
    const modalRef = this.modalService.open(DeleteModalComponent, { centered: true });
    modalRef.componentInstance.info = {
      title: 'Xóa người dùng',
      content: 'Bạn có muốn xóa người dùng ' + user.username
    };
    modalRef.componentInstance.ids = user.id;
    modalRef.componentInstance.bgColor = '#F64E60';
    modalRef.componentInstance.baseService = this.usersService;

    modalRef.closed.subscribe(v => {
      if (v) {
        if (v.error) {
          this.showError(v.error, this.ref);
        }
        this.usersService.fetch();
        window.scrollTo(0, 0);
      }
    });
  }
}
