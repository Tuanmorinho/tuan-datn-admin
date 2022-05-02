import { ChangeDetectorRef, Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '@app/modules/core/base/base.component';
import { ComponentService } from '@app/services/component.service';
import { UserRoleService } from '@app/services/user-role.service';
import { map, finalize } from 'rxjs/operators';

@Component({
  selector: 'edit-user-role',
  templateUrl: './edit-user-role.component.html',
  styleUrls: ['./edit-user-role.component.scss'],
})

export class EditUserRoleComponent extends BaseComponent {
  formGroup: FormGroup;
  permissionList: any[] = [];
  loading$: any;

  label: string
  permisisons = [];

  INITIAL_OPACITY = 1;
  DIMMED_OPACITY = 0.3;

  // private map: ol.Map;
  constructor(
    public userRoleService: UserRoleService,
    private fb: FormBuilder,
    protected service: ComponentService,
    public ref: ChangeDetectorRef) {
    super(service);
    this.loading$ = userRoleService.isLoading$;
    this.filterUserRole();
  }

  ngOnInit() {
    if (!this.isModal)
      this.service.subheaderService.updateBreadcrumbs(
        [
          {
            title: "Danh sách phân quyền",
            linkPath: '/system-admin/user-role',
          }
        ],
        "Trang chủ",
        [
          {
            name: "Thoát",
            class: "btn btn-outline-dark mr-3",
            url: "/system-admin/user-role",
          },
          {
            name: "Lưu",
            class: "btn btn-primary mr-3",
            isEvent: true,
            type: 'submit'
          },
        ],
        "Quản lý phiếu nhập kho"
      );
    
    this.subscription = this.service.subheaderService.eventEmit.subscribe(v => {
      if (v === 'submit') {
        this.onSubmit();
      }
    });
    this.formGroup = this.fb.group({
      id: [],
      permisisons: this.fb.array([], Validators.required)
    });
    const id = this.routeParams['id'];
    if (id) {
      this.getPermission(id);
      this.getRoleDescription(id);
    }    
  }
  get f() {
    return this.formGroup.controls;
  }

  get v() {
    return this.formGroup.value;
  }
  
  getRoleDescription(id) {
    this.userRoleService.getUserRoles().pipe(
      map(r => r.find(u => u?.id === id)),
      finalize(() => {
        this.service.subheaderService.updateSubBreadcrumbs([
          {
            title: `Phân quyền ${this.label.toLowerCase()}`,
            linkPath: this.router.url,
            linkText: 'Phân quyền vai trò',
          }
        ], 'Trang chủ');
      })
    ).subscribe(s => this.label = s.description);
  }

  onSubmit() {
    let itemChecked = [];
    this.permissionList.forEach(v => {
      if (v.view) {
        let item = this.permisisons.find(v1 => v1.name === `${v.name}_VIEW`);
        if (item) {
          itemChecked.push({
            id: item.id,
            name: `${v.name}_VIEW`
          });
        }
      }
      if (v.create) {
        let item = this.permisisons.find(v1 => v1.name === `${v.name}_CREATE`);
        if (item) {
          itemChecked.push({
            id: item.id,
            name: `${v.name}_CREATE`
          });
        }
      }
      if (v.update) {
        let item = this.permisisons.find(v1 => v1.name === `${v.name}_UPDATE`);
        if (item) {
          itemChecked.push({
            id: item.id,
            name: `${v.name}_UPDATE`
          });
        }
      }
      if (v.delete) {
        let item = this.permisisons.find(v1 => v1.name === `${v.name}_DELETE`);
        if (item) {
          itemChecked.push({
            id: item.id,
            name: `${v.name}_DELETE`
          });
        }
      }
    });
    const roleId = this.routeParams['id'];
    this.userRoleService.setPermission(itemChecked, roleId).subscribe(res => {
      this.service.alertFlashService.success(['Phân quyền thành công'], this.optionsAlert);
      this.router.navigate(['/system-admin/user-role'])
    }, error => {
      this.showError(error, this.ref);
    })
  }

  async getPermission(id) {
    const activepermisisons = await this.userRoleService.getListPermissionActive(id).toPromise();
    this.permisisons = await this.userRoleService.getPermission().toPromise();

    this.permisisons.forEach(v => {
      const name = v.name.split('_');
      const index = this.permissionList.findIndex(v1 => name.length ? name.indexOf(v1.name) != -1 : false);
      if (index == -1) {
        this.permissionList.push({
          name: name[0],
          description: v.attributes?.categoryTitle ? v.attributes?.categoryTitle[0] : '',
          view: false,
          create: false,
          update: false,
          delete: false
        })
      } else {
        if (v.attributes?.categoryTitle && v.attributes?.categoryTitle[0]) {
          this.permissionList[index].description = v.attributes?.categoryTitle[0];
        }
        if (activepermisisons.find(v1 => v1.name === `${name[0]}_VIEW`)) {
          this.permissionList[index].view = true;
        }
        if (activepermisisons.find(v1 => v1.name === `${name[0]}_CREATE`)) {
          this.permissionList[index].create = true;
        }
        if (activepermisisons.find(v1 => v1.name === `${name[0]}_UPDATE`)) {
          this.permissionList[index].update = true;
        }
        if (activepermisisons.find(v1 => v1.name === `${name[0]}_DELETE`)) {
          this.permissionList[index].delete = true;
        }
      }
    });
  }

  userPermisisons(): FormArray {
    return this.formGroup.get('permisisons') as FormArray
  }

  addDepartDetail() {
    this.userPermisisons().push(this.newPermission());
  }

  newPermission() {
    return this.fb.group({
      name: [, Validators.compose([Validators.required])],
      subPermisison: this.fb.array([]),
    })
  }
}
