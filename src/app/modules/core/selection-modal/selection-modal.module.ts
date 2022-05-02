import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectionModalComponent } from '@app/modules/core/selection-modal/selection-modal.component';
import { CustomTableDirective } from '@app/modules/core/selection-modal/_directive/custom-table.directive';
import { PipesModule } from '@app/pipes/pipes.module';
import { CRUDTableModule } from '@app/_metronic/shared/crud-table';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg';


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
        NgbDatepickerModule,
    ],
    exports: [SelectionModalComponent,CustomTableDirective],
    declarations: [SelectionModalComponent,CustomTableDirective],
    entryComponents:[
        SelectionModalComponent
    ],
    providers: [],
})
export class SelectionModalModule { }
