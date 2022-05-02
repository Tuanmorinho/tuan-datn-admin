import { ChangeDetectorRef, Component, QueryList, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '@app/modules/core/base/base.component';
import { ConfirmModalComponent } from '@app/modules/core/confirm-modal/confirm-modal.component';
import { ComponentService } from '@app/services/component.service';
import { UserRoleService } from '@app/services/user-role.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RoleModel } from '../../_models/role.model';

@Component({
    selector: 'app-user-role',
    templateUrl: './user-role.component.html',
    styleUrls: ['./user-role.component.scss']
})

export class UserRoleComponent extends BaseComponent {
    @ViewChild('roleForm') roleForm: TemplateRef<any>;

    userRolesList: any[] = [];
    formGroup: FormGroup;
    actionStatus: boolean = true;
    modalReference: any;
    constructor(
        public userRoleService: UserRoleService,
        protected service: ComponentService,
        public ref: ChangeDetectorRef,
        private ngModal: NgbModal,
        public modal: NgbActiveModal,
        private fb: FormBuilder) {
        super(service);
    }

    async ngOnInit() {
        this.service.subheaderService.updateBreadcrumbs([
            {
                title: 'Phân quyền vai trò',
                linkPath: this.router.url,
                linkText: 'Phân quyền vai trò',
            }
        ], 'Trang chủ',
        [
            {
                name: 'Thêm vai trò',
                icon: 'ki ki-plus icon-sm',
                url: '',
                class: 'btn btn-primary',
                type: 'add',
                isEvent: true,

            }
        ], 'Phân quyền vai trò');
        this.loadRole();
        this.formGroup = this.fb.group({
            id: [],
            name: [, Validators.required],
            description: []
        });

        this.subscription = this.service.subheaderService.eventEmit.subscribe(v => {
            if (v === 'add') {
                this.addRole(this.roleForm);
            }
        });
    }

    loadRole() {
        this.userRoleService.getUserRoles().subscribe(x => {
            this.userRolesList = x;
            this.ref.detectChanges();
        });
    }

    onSubmit() {
        this.formGroup.markAllAsTouched();
        if (this.formGroup.invalid) {
            return;
        }
        const data = this.formGroup.value;
        if (data.id) {
            this.userRoleService.updateRole(data).subscribe(_ => {
                this.service.alertFlashService.success(['Sửa vai trò thành công'], this.optionsAlert);
                this.modalReference.close();
                this.loadRole();
            }, error => {
                this.showError(error, this.ref);
            });
        } else {
            this.userRoleService.createRole(data).subscribe(_ => {
                this.service.alertFlashService.success(['Tạo vai trò thành công'], this.optionsAlert);
                this.modalReference.close();
                this.loadRole();
            }, error => {
                this.showError(error, this.ref);
            });
        }
    }

    addRole(roleForm) {
        this.actionStatus = true;
        this.formGroup.reset();
        this.modalReference = this.ngModal.open(roleForm, { centered: true });
    }

    updateRole(roleForm, data) {
        this.actionStatus = false;
        this.formGroup.patchValue({
            id: data.id,
            name: data.name,
            description: data.description
        });
        this.modalReference = this.ngModal.open(roleForm, { centered: true });
    }

    deleteRole(role: RoleModel) {
        const modalRef = this.ngModal.open(ConfirmModalComponent, { centered: true });
        modalRef.componentInstance.info = {
            title: 'Xóa vai trò',
            content: 'Bạn có muốn xóa vai trò ' + role.name
        };
        modalRef.closed.subscribe(v => {
            if (v) {
                this.userRoleService.deleteRole(role.id).subscribe(_ => {
                    this.service.alertFlashService.success(['Xóa vai trò thành công'], this.optionsAlert);
                    this.loadRole();
                }, error => {
                    this.showError(error, this.ref);
                });
            }
            window.scrollTo(0, 0);
            this.ref.detectChanges();
        });        
    }

    public edit(id: string) {
        this.router.navigate(['/system-admin/user-role/edit/' + id]);
    }
}
