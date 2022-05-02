import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CRUDTableModule } from '@app/_metronic/shared/crud-table';
import { NgbActiveModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg';
import { CarfRoutingModule } from './carf-routing.module';
import { TableModule } from '@app/modules/core/table/table.module';
import { ValidationErrorModule } from '../core/validation-error/validation-error.module';
import { baseComponentProviders } from '@app/modules/core/base/base.component';
import { CarfComponent } from './list/carf.component';
import { EditCarfComponent } from './edit-carf/edit-carf.component';
import { ReusableComponentsModule } from '../core/reusable-components/reusable-components.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DetailCarfComponent } from './detail-carf/detail-carf.component';
import { DetailCellComponent } from './components/detail-cell/detail-cell.component';

@NgModule({
    imports: [
        CommonModule,
        CarfRoutingModule,
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
    ],
    exports: [
    ],
    declarations: [
        CarfComponent,
        EditCarfComponent,
        DetailCarfComponent,
        DetailCellComponent
    ],
    providers: [baseComponentProviders, NgbActiveModal],
})
export class CarfModule { }
