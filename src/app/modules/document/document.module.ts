import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioModule } from '@angular/material/radio';
import { DocumentBaseComponent } from '@app/modules/document/document-base.component';
import { DocumentRoutingModule } from '@app/modules/document/document-routing.module';
import { DocumentComponent } from '@app/modules/document/list-document/document.component';
import { CRUDTableModule } from '@app/_metronic/shared/crud-table';
import { NgbDatepickerModule, NgbModalModule, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg';
import { MatSelectModule } from '@angular/material/select';
import { TableModule } from '@app/modules/core/table/table.module';
import { ValidationErrorModule } from '../core/validation-error/validation-error.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { baseComponentProviders } from '@app/modules/core/base/base.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon'
import { FileCellComponent } from '@app/modules/document/components/file-cell/file-cell.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import { DirectivesModule } from '@app/modules/core/directives/directives.module';
import { DetailDocumentComponent } from './detail-document/detail-document.component';
import { ReusableComponentsModule } from '@app/modules/core/reusable-components/reusable-components.module';
import { DetailCellComponent } from './components/detail-cell/detail-cell.component';
import { ActionCellComponent } from './components/action-cell/action-cell.component';
import { MatListModule } from '@angular/material/list';
import { TextEditorModule } from '../core/editor/editor.module';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { PipesModule } from '@app/pipes/pipes.module';
import { FilterFileDeletedPipe } from '@app/pipes/filter-file-deleted.pipe';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {SecuritylevelCellComponent} from '@app/modules/document/components/securitylevel-cell/securitylevel-cell.component';
@NgModule({
    imports: [
        CommonModule,
        DocumentRoutingModule,
        FormsModule,
        TableModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        InlineSVGModule,
        CRUDTableModule,
        MatRadioModule,
        MatExpansionModule,
        MatMomentDateModule,
        MatDatepickerModule,
        MatSelectModule,
        NgbModalModule,
        MatIconModule,
        MatChipsModule,
        NgbDatepickerModule,
        ValidationErrorModule,
        NgSelectModule,
        MatTooltipModule,
        DirectivesModule,
        ReusableComponentsModule,
        MatListModule,
        TextEditorModule,
        NgbProgressbarModule,
        MatButtonModule,
        MatNativeDateModule,
        PipesModule,
        OwlDateTimeModule, 
        OwlNativeDateTimeModule,
        MatProgressBarModule
    ],
    exports: [
        DocumentBaseComponent,
        FileCellComponent,
        DetailCellComponent,
        DetailDocumentComponent,
        ActionCellComponent
    ],
    declarations: [
        DocumentBaseComponent,
        DocumentComponent,
        FileCellComponent,
        DetailCellComponent,
        DetailDocumentComponent,
        ActionCellComponent,
        SecuritylevelCellComponent
    ],
    providers: [baseComponentProviders, FilterFileDeletedPipe],
})
export class DocumentModule { }
