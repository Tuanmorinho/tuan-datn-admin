import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd } from '@angular/router';
import { BaseComponent } from '@app/modules/core/base/base.component';
import { ConfirmModalComponent } from '@app/modules/core/confirm-modal/confirm-modal.component';
import { DeleteModalComponent } from '@app/modules/core/delete-modal/delete-modal.component';
import { PermissionCellComponent } from '@app/modules/core/reusable-components/components/permission-cell/permission-cell.component';
import { SelectionModalComponent } from '@app/modules/core/selection-modal/selection-modal.component';
import { ColumnConfig } from '@app/modules/core/table/_models/column.config';
import { addDays } from '@app/modules/core/utils/helpers';
import { FileCellComponent } from '@app/modules/document/components/file-cell/file-cell.component';
import { UsersComponent } from '@app/modules/users/list/users.component';
import { ComponentService } from '@app/services/component.service';
import { GroupingState, PaginatorState, SortState } from '@app/_metronic/shared/crud-table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'environments/environment.prod';
import { filter } from 'rxjs/operators';
import { ActionCellComponent } from '../components/action-cell/action-cell.component';
import { DetailCellComponent } from '../components/detail-cell/detail-cell.component';
import { DocumentModel } from '../_models/document.model';

@Component({
    selector: 'app-document',
    templateUrl: './document.component.html',
    styleUrls: ['./document.component.scss'],
})

export class DocumentComponent extends BaseComponent implements OnInit, OnDestroy {
    isLoading: boolean = false;
    searchGroup: FormGroup;
    paginator: PaginatorState;
    sorting: SortState;
    grouping: GroupingState;
    departmentList: [];
    documentTypeList: [];
    isLoadingDocTypeList: boolean = false;
    isApprove: boolean = false;
    columnsConfig: ColumnConfig[] = [
        { label: 'Mã tài liệu', dataKey: 'code', sort: true, fixedColumn: true, minWidth: 120, width: 120 },
        { label: 'Tên tài liệu', dataKey: 'name', sort: true, fixedColumn: true, component: DetailCellComponent, minWidth: 150, width: 250 },
        { label: 'File tài liệu', dataKey: 'fileMain', sort: false, minWidth: 200, width: 200, component: FileCellComponent },
        { label: 'Số lần soát xét', dataKey: 'revision', sort: true, minWidth: 140, width: 140 },
        { label: 'Mục đích sử dụng', dataKey: 'usingPurposeDocument', sort: true, minWidth: 150, width: 150 },
        { label: 'Ngày hiệu lực', dataKey: 'effectiveDate', sort: false, minWidth: 120, width: 120, predict: (item) => new DatePipe('vi-VI').transform(item.effectiveDate, 'dd/MM/yyyy HH:mm') },
        { label: 'Thời gian hiệu lực', dataKey: 'duration', sort: false, minWidth: 120, width: 120 },
        { label: 'Ngày hết hạn hiệu lực', dataKey: '', sort: false, minWidth: 170, width: 170, predict: (item) => addDays(item.effectiveDate, item.duration) },
        { label: 'Loại tài liệu', dataKey: 'documentTypeName', sort: true, minWidth: 150, width: 150 },
        { label: 'Soạn thảo', dataKey: 'authors', sort: false, component: PermissionCellComponent, minWidth: 150, width: 150 },
        { label: 'Kiểm duyệt', dataKey: 'bods', sort: false, component: PermissionCellComponent, minWidth: 130, width: 130 },
        { label: '', dataKey: 'actionCell', sort: false, component: ActionCellComponent, minWidth: 175, width: 175 },
    ]

    constructor(
        protected service: ComponentService,
        private fb: FormBuilder,
        public ref: ChangeDetectorRef,
        private modalService: NgbModal) {
        super(service)
    }
    async ngOnInit() {
        if (this.isModal) this.columnsConfig.pop();
        if (!this.isModal) this.service.subheaderService.updateBreadcrumbs([
            {
                title: 'Hệ thống tài liệu',
                linkPath: this.router.url,
                linkText: 'Danh sách hệ thống tài liệu',
            }
        ], 'Hệ thống tài liệu');
        this.searchGroup = this.fb.group({
            usingPurposeDocument: [],
            keyword: ['', Validators.compose([Validators.maxLength(100)])],
            dateFrom: [],
            dateTo: [],
            duration: [],
            code: ['', Validators.compose([Validators.maxLength(100)])],
            authorId: [],
            authorName: [],
            checkerId: [],
            checkerName: [],
            departmentId: [],
            documentTypeId: [],
            documentTypeFlag: [0],
            reviewStatus: [[3, 4, 9]],
            deleteFlag: []
        });

        this.searchGroup.controls.authorName.valueChanges.subscribe(res => {
            if (!res) {
                this.searchGroup.patchValue({
                    authorId: null
                })
            }
        })

        this.searchGroup.controls.checkerName.valueChanges.subscribe(res => {
            if (!res) {
                this.searchGroup.patchValue({
                    checkerId: null
                })
            }
        })
    }

    get searchGroupValue() {
        return this.searchGroup.value;
    }

    filterDeleted() {
        if (this.activatedRoute.snapshot.routeConfig.path === 'deleted') {
            this.searchGroup.patchValue({
                deleteFlag: 1
            });
        }
    }

    reset() {
        this.searchGroup.reset({
            usingPurposeDocument: '',
            dateTo: new Date(),
            documentTypeFlag: '0',
            reviewStatus: [3, 4, 9]
        });
        this.filterDeleted();
        this.isApprove = false;
        if (this.filter) {
            if (this.filter.departmentId) {
                this.searchGroup.patchValue({
                    departmentId: this.filter.departmentId
                });
            }
            if (this.filter.documentTypeId) {
                this.searchGroup.patchValue({
                    documentTypeId: this.filter.documentTypeId
                })
            }
            if (this.filter.documentTypeFlag) {
                this.searchGroup.patchValue({
                    documentTypeFlag: Number(this.filter.documentTypeFlag)
                })
            }
        }
        this.fetchData();
    }

    search() {
        this.fetchData();
    }

    fetchData() {
        const data = this.searchGroupValue;
        if (!data.authorName) data.authorId = null;
        if (!data.checkerName) data.checkerId = null;
        if (!data.usingPurposeDocument) {
            delete data.usingPurposeDocument;
        } else {
            data.usingPurposeDocument = Number(data.usingPurposeDocument);
        }
        if (data.duration == null) {
            delete data.duration
        } else {
            data.duration = Number(data.duration);
        }
        if (Number(data.documentTypeFlag)) {
            if (Number(data.documentTypeFlag) === 1) {
                this.searchGroup.patchValue({
                    reviewStatus: [3]
                });
            } else if (Number(data.documentTypeFlag) === 2) {
                this.searchGroup.patchValue({
                    reviewStatus: [4]
                });
            } else if (Number(data.documentTypeFlag) === 3) {
                this.searchGroup.patchValue({
                    reviewStatus: [9]
                });
            }
            this.isApprove = true;
        } else {
            this.searchGroup.patchValue({
                reviewStatus: [3, 4, 9]
            });
            this.isApprove = false;
        }
    }

    public sort(state) {
    }

    ngOnDestroy(): void {
        // this.documentService.subscriptions.forEach(sb => sb.unsubscribe());
    }
}
