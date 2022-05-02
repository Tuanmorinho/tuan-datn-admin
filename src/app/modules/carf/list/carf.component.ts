import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseComponent } from '@app/modules/core/base/base.component';
import { DeleteModalComponent } from '@app/modules/core/delete-modal/delete-modal.component';
import { ColumnConfig } from '@app/modules/core/table/_models/column.config';
import { ComponentService } from '@app/services/component.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DetailCellComponent } from '../components/detail-cell/detail-cell.component';
import { CarfModel } from '../_models/carf.model';

@Component({
    selector: 'app-carf',
    templateUrl: './carf.component.html',
    styleUrls: ['./carf.component.scss'],
})

export class CarfComponent extends BaseComponent implements OnInit, OnDestroy {

    isLoading$: any;
    searchGroup: FormGroup;
    columnsConfig: ColumnConfig[] = [
        { label: 'Mã báo cáo', dataKey: 'reportCode', sort: true, minWidth: 160, component: DetailCellComponent, width: 160 },
        { label: 'Địa chỉ', dataKey: 'location', sort: false, minWidth: 170, width: 170 },
    ];

    constructor(
        protected service: ComponentService,
        public ref: ChangeDetectorRef,
        private modalService: NgbModal,
        private fb: FormBuilder) {
        super(service)
    }

    async ngOnInit() {
        if (!this.isModal) this.service.subheaderService.updateBreadcrumbs([
            {
                title: 'Khắc phục phòng ngừa',
                linkPath: this.router.url,
                linkText: 'Danh sách khắc phục phòng ngừa',
            }
        ], 'Khắc phục phòng ngừa');        
        this.searchGroup = this.fb.group({
            keyword: [''],
            carfType: ['0'],
            carfncType: ['0']
        });
    }

    search() {
        let data = JSON.parse(JSON.stringify(this.searchGroup.value));
        if (Number(data.carfType) >= 0) {
            data.carfType = Number(data.carfType);
        } else {
            delete data.carfType;
        }

        if (Number(data.carfncType) >= 0) {
            data.carfncType = Number(data.carfncType);
        } else {
            delete data.carfncType;
        }

        if (this.filter) {
            data = { ...this.filter, data }
        }
    }

    reset() {
        this.searchGroup.reset({
            carfType: '0',
            carfncType: '0'
        });
        this.search();
    }

    public sort(state) {
    }

    ngOnDestroy(): void {
    }
}