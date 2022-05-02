import { ActionCellComponent } from '../components/action-cell/action-cell.component';
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseComponent } from '@app/modules/core/base/base.component';
import { ColumnConfig } from '@app/modules/core/table/_models/column.config';
import { ComponentService } from '@app/services/component.service';
import { UsersService } from '@app/services/users.service';
import { DetailCellComponent } from '../components/detail-cell/detail-cell.component';
import { ITableState } from '@app/_metronic/shared/crud-table';
import { sort_by } from '@app/modules/core/utils/helpers';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
    providers: [UsersService]
})
export class UsersComponent extends BaseComponent implements OnDestroy {
    searchGroup: FormGroup;
    roleList: [];
    enableList = [{value: true, name: 'Đang hoạt động'}, {value: false, name: 'Dừng hoạt động'}];
    columnsConfig: ColumnConfig[] = [
        { label: 'Người dùng', dataKey: 'firstName', sort: true, minWidth: 150, component: DetailCellComponent },
        { label: 'Vai trò', dataKey: 'realmRoles', sort: true, minWidth: 120, predict: (prop) => prop?.realmRoles?.join(', ') },
        { label: 'Email', dataKey: 'email', sort: true, minWidth: 120 },
        { label: 'Số điện thoại ', dataKey: 'attributes.phone', sort: false, minWidth: 150, predict: (prop) => prop?.attributes?.phone },
        { label: 'Tên đăng nhập', dataKey: 'username', sort: true, minWidth: 150},
        { label: 'CCCD ', dataKey: 'attributes.identifyCode', sort: false, minWidth: 120, predict: (prop) => prop?.attributes?.identifyCode },
        { label: 'Trạng thái', dataKey: 'enabled', sort: true, minWidth: 130, component: UserStatusCellComponent},
        { label: 'Hành động', dataKey: 'actionCell', minWidth: 150, sort: false, component: ActionCellComponent},
    ];

    constructor(
        public usersService: UsersService,
        protected service: ComponentService,
        public ref: ChangeDetectorRef,
        private fb: FormBuilder) {
        super(service);
    }

    async ngOnInit() {
        if (!this.isModal)
            this.service.subheaderService.updateBreadcrumbs(
                [
                    {
                        title: "Quản trị người dùng",
                        linkPath: this.router.url,
                        linkText: 'Người quản trị',
                    }
                ],
                'Trang chủ',
                [
                    {
                        name: 'Thêm người dùng',
                        class: "btn btn-primary",
                        url: '/system-admin/users/add',
                        icon: 'ki ki-plus icon-sm',
                        disable: false
                    }
                ],
                'Danh sách người dùng');
        this.getListRole();
        this.usersService.fetch();
        this.searchGroup = this.fb.group({
            keyword: [''],
            realmRoles: [],
            enabled: []
        });
    }

    getListRole() {
        this.usersService.role().subscribe((role) => {
            this.roleList = role;
        });
    }

    get searchGroupValue() {
        return this.searchGroup.value;
    }

    search() {
        this.usersService.itemsFilter$.subscribe(items => {
            let usersFilterByKeyword = items
            if (this.searchGroupValue.keyword) {
                usersFilterByKeyword = items.filter((v) => {
                    return (
                        (v.username
                            ? v.username.includes(this.searchGroupValue.keyword)
                            : false) ||
                        (v.email ? v.email.includes(this.searchGroupValue.keyword) : false)
                    );
                });
            }
            if (this.searchGroupValue.realmRoles) {
                usersFilterByKeyword = usersFilterByKeyword.filter((r) => {
                    return r?.realmRoles.length !== 0
                        ? r.realmRoles.find((d) => d === this.searchGroupValue.realmRoles)
                        : false;
                });
            }
            if (this.searchGroupValue.enabled) {
                usersFilterByKeyword = usersFilterByKeyword.filter((r) => {
                    return r?.enabled
                        ? r.enabled === this.searchGroupValue.enabled
                        : false;
                });
            }
            this.usersService.items = usersFilterByKeyword;
        });
    }

    reset() {
        this.searchGroup.reset();
        this.usersService.fetch();
    }

    public sort(state: ITableState) {
        if (state.sorting) {
            this.usersService.itemsFilter$.subscribe(items => {
                this.usersService.items = items.sort(sort_by(state.sorting.column, state.sorting.direction === 'asc' ? true : false, (a) =>  a
                )).slice(0, this.usersService?.paginator.pageSize);
            });
        }
        if (state.paginator) {
            this.usersService.itemsFilter$.subscribe(items => {
                this.usersService.items = items.slice((state.paginator.page - 1) * state.paginator.pageSize, state.paginator.page * state.paginator.pageSize);
            });
        }
    }

    ngOnDestroy(): void {
        this.usersService.subscriptions.forEach(sb => sb.unsubscribe());
    }
}

@Component({
    template: `
        <span [attr.class]="prop?.enabled ? 'userActive' : 'userDisable'">{{ prop?.enabled ? 'Đang hoạt động' : 'Dừng hoạt động' }}</span>
    `,
    styleUrls: ['./users.component.scss'],
})
export class UserStatusCellComponent implements OnInit {
    @Input() prop;
    ngOnInit(): void {}
}
