import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseComponent } from '@app/modules/core/base/base.component';
import { PermissionCellComponent } from '@app/modules/core/reusable-components/components/permission-cell/permission-cell.component';
import { ColumnConfig } from '@app/modules/core/table/_models/column.config';
import { ComponentService } from '@app/services/component.service';
import { ACCService } from '@app/services/acc/acc.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActionCellComponent } from '../components/action-cell/action-cell.component';
import { ACCDetailCellComponent } from '../components/detail-cell/detail-cell.component';

@Component({
    selector: 'app-acc',
    templateUrl: './acc.component.html',
    styleUrls: ['./acc.component.scss'],
})

export class ACCComponent extends BaseComponent implements OnInit, OnDestroy {

    isLoading$: any;
    searchGroup: FormGroup;

    columnsConfig: ColumnConfig[] = [
        { label: 'ACC #', dataKey: 'code', sort: true, minWidth: 150, width: 150, component: ACCDetailCellComponent },
        { label: 'Ngày lập phiếu', dataKey: '', sort: false, minWidth: 150, width: 150, component: RequestDateComponent },
        { label: 'Tên phần mềm', dataKey: 'shortName', sort: false, minWidth: 150, width: 150, component: SoftwareComponent },
        { label: 'Hình thức điều chỉnh | Phạm vi điều chỉnh | Thông tin điều chỉnh', dataKey: '', sort: false, minWidth: 180, width: 180, component: TypeSettingComponent },
        { label: 'Nội dung sai', dataKey: '', sort: false, minWidth: 170, width: 170, component: ContentIncorrectComponent },
        { label: 'Nội dung khắc phục', dataKey: '', sort: false, minWidth: 170, width: 170, component: ContentCorrectComponent },
        { label: 'Người lập phiếu', dataKey: 'authors', sort: false, minWidth: 170, width: 170, component: PermissionCellComponent },
        { label: 'Kiểm tra 1', dataKey: 'checkerTBPs', sort: false, minWidth: 170, width: 170, component: PermissionCellComponent },
        { label: 'Kiểm tra 2', dataKey: 'checkerCFNs', sort: false, minWidth: 170, width: 170, component: PermissionCellComponent },
        { label: 'Kiểm tra 3', dataKey: 'checkerITs', sort: false, minWidth: 170, width: 170, component: PermissionCellComponent },
        { label: 'Phê duyệt', dataKey: 'approvers', sort: false, minWidth: 170, width: 170, component: PermissionCellComponent },
        { label: 'Người thừa hành', dataKey: 'pics', sort: false, minWidth: 170, width: 170, component: PermissionCellComponent },
        { label: 'Các users liên quan phiếu yêu cầu', dataKey: 'relatedUser', sort: false, minWidth: 170, width: 170, component: PermissionCellComponent },
        { label: 'Người đóng phiếu yêu cầu', dataKey: 'cancelRequestUser', sort: false, minWidth: 170, width: 170, component: PermissionCellComponent },
        { label: '', dataKey: 'actionCell', sort: false, minWidth: 150, width: 150, component: ActionCellComponent },
    ];

    constructor(
        public ACCService: ACCService,
        protected service: ComponentService,
        public ref: ChangeDetectorRef,
        private fb: FormBuilder) {
        super(service)
        this.isLoading$ = this.ACCService.isLoading$;
    }

    async ngOnInit() {
        if (!this.isModal) this.service.subheaderService.updateBreadcrumbs([
            {
                title: 'Quản lý phiếu yêu cầu điều chỉnh dữ liệu',
                linkPath: this.router.url,
                linkText: 'Danh sách phiếu yêu cầu điều chỉnh dữ liệu',
            }
        ], 'Quản lý phiếu yêu cầu điều chỉnh dữ liệu');
        
        this.ACCService.patchStateWithoutFetch({ sorting: { column: 'Id', direction: 'desc' } })
        this.ACCService.fetch();
        this.searchGroup = this.fb.group({
            keyword: [''],
            dateContent: []
        });
    }

     search() {
        const data = JSON.parse(JSON.stringify(this.searchGroup.value));
        this.ACCService.patchState({ filter: data, sorting: { column: 'Id', direction: 'desc' } });
    }

    reset() {
        this.searchGroup.reset();
        this.search();
    }

    public sort(state) {
        this.ACCService.patchState(state)
    }

    ngOnDestroy(): void {
        this.ACCService.subscriptions.forEach(sb => sb.unsubscribe());
    }
}


@Component({
    template: `<div>{{ prop?.typeSetting.name }}</div>`
})
class TypeSettingComponent implements OnInit {
    @Input() prop;
    ngOnInit() { }
}

@Component({
    template: `<div>{{ prop?.software.name }}</div>`
})
class SoftwareComponent implements OnInit {
    @Input() prop;
    ngOnInit() { }
}

@Component({
    template: `<div [innerHTML]="prop?.contentIncorrect"></div>`
})
class ContentIncorrectComponent implements OnInit {
    @Input() prop;
    ngOnInit() { }
}

@Component({
    template: `<div [innerHTML]="prop?.contentCorrective"></div>`
})
class ContentCorrectComponent implements OnInit {
    @Input() prop;
    ngOnInit() { }
}

@Component({
    template: `<div>{{ prop.dateCreated | date:'dd/MM/yyyy HH:mm' }}</div>`
})
export class RequestDateComponent implements OnInit {
    @Input() prop;
    ngOnInit() { }
}