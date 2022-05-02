import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BasicTableComponent } from '@app/modules/core/table/basic-table/basic-table.component';
import { TreeTableComponent } from '@app/modules/core/table/tree-table/tree-table.component';
import { CustomCellDirective } from '@app/modules/core/table/_directive/custom-cell.directive';
import { PipesModule } from '@app/pipes/pipes.module';
import { CRUDTableModule } from '@app/_metronic/shared/crud-table';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg';
import { FilterSectionPipe } from './filter-section.pipe';
import { BasicTableFilterComponent } from './basic-table-filter/basic-table-filter.component';
import { DateCreatedCellComponent } from '@app/modules/core/table/_components/date-created-cell/date-created-cell.component';
import { DateModifiedCellComponent } from '@app/modules/core/table/_components/date-modified-cell/date-modified-cell.component';
import { CustomSubCellDirective } from '@app/modules/core/table/_directive/custom-sub-cell.directive';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReusableComponentsModule } from '../reusable-components/reusable-components.module';
import { ValidationErrorModule } from '../validation-error/validation-error.module';
import { TextEditorModule } from '../editor/editor.module';
import { CommentTableViewComponent } from './comment-table-view/comment-table-view.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { baseComponentProviders } from '../base/base.component';
import { SettingHeaderTableComponent } from '@app/modules/core/table/setting-header-table/setting-header-table.component';
import { DirectivesModule } from '@app/modules/core/directives/directives.module';
import { SettingDropdownComponent } from '@app/modules/core/table/setting-header-table/_components/dropdown/dropdown.componnent';
import { FixedColumnDirective } from '@app/modules/core/table/_directive/fixed-column.directive';
import {BasicTablePageComponent} from '@app/modules/core/table/basic-table-page/basic-table-page.component';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        PipesModule,
        ReactiveFormsModule,
        InlineSVGModule,
        CRUDTableModule,
        NgbModalModule,
        MatCheckboxModule,
        NgbDatepickerModule,
        MatRadioModule,
        // ReusableComponentsModule,
        ValidationErrorModule,
        TextEditorModule,
        OwlDateTimeModule, 
        OwlNativeDateTimeModule, 
        DirectivesModule,
    ],
    exports: [
        BasicTableComponent,
        BasicTablePageComponent,
        FilterSectionPipe,
        BasicTableFilterComponent,
        CommentTableViewComponent,
        SettingHeaderTableComponent,
        SettingDropdownComponent,
    ],
    declarations: [
        BasicTableComponent,
        BasicTablePageComponent,
        CustomCellDirective,
        CustomSubCellDirective,
        FilterSectionPipe,
        TreeTableComponent,
        BasicTableFilterComponent,
        DateCreatedCellComponent,
        DateModifiedCellComponent,
        CommentTableViewComponent,
        SettingHeaderTableComponent,
        SettingDropdownComponent,
        FixedColumnDirective
    ],
    providers: [baseComponentProviders],
})
export class TableModule { }
