import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CRUDTableModule } from '@app/_metronic/shared/crud-table';
import { NgbActiveModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg';
import { ACCRoutingModule } from './acc-routing.module';
import { TableModule } from '@app/modules/core/table/table.module';
import { ValidationErrorModule } from '../core/validation-error/validation-error.module';
import { baseComponentProviders } from '@app/modules/core/base/base.component';
import { RequestDateComponent, ACCComponent } from './list/acc.component';
import { EditACCComponent } from './edit-acc/edit-acc.component';
import { ReusableComponentsModule } from '../core/reusable-components/reusable-components.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TextEditorModule } from '../core/editor/editor.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { DetailACCComponent } from './detail-acc/detail-acc.component';
import { ACCDetailCellComponent } from './components/detail-cell/detail-cell.component';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ActionCellComponent } from './components/action-cell/action-cell.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FilterRangeSettingDetailsPipe } from './filter-detail.pipe';

@NgModule({
    imports: [
        CommonModule,
        ACCRoutingModule,
        TableModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        InlineSVGModule,
        CRUDTableModule,
        NgbModalModule,
        ValidationErrorModule,
        ReusableComponentsModule,
        MatTooltipModule,
        NgSelectModule,
        MatRadioModule,
        MatCheckboxModule,
        TextEditorModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        MatDatepickerModule
    ],
    exports: [
    ],
    declarations: [
        ACCComponent,
        EditACCComponent,
        RequestDateComponent,
        DetailACCComponent,
        ACCDetailCellComponent,
        ActionCellComponent,
        FilterRangeSettingDetailsPipe
    ],
    providers: [baseComponentProviders, NgbActiveModal, FlashMessagesService],
})
export class ACCModule { }
