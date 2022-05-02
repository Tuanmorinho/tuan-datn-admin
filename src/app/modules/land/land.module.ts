import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { CRUDTableModule } from '@app/_metronic/shared/crud-table';
import { NgbActiveModal, NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { TableModule } from '@app/modules/core/table/table.module';
import { ValidationErrorModule } from '../core/validation-error/validation-error.module';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { baseComponentProviders } from '@app/modules/core/base/base.component';
import { DirectivesModule } from '@app/modules/core/directives/directives.module';
import { ReusableComponentsModule } from '@app/modules/core/reusable-components/reusable-components.module';
import { MatIconModule } from '@angular/material/icon';
import { LandRoutingModule } from './land-routing.module';
import { MapLandComponent } from './map/list/map.component';
import { ActionCellComponent } from './map/components/action-cell/action-cell.component';
import { UserManualComponent } from './map/components/user-manual/user-manual.component';

@NgModule({
    imports: [
        CommonModule,
        TableModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        InlineSVGModule,
        CRUDTableModule,
        MatExpansionModule,
        NgbModalModule,
        ValidationErrorModule,
        MatDatepickerModule,
        NgbDatepickerModule,
        MatMomentDateModule,
        MatIconModule,
        DirectivesModule,
        FlashMessagesModule.forRoot(),
        ReusableComponentsModule,
        LandRoutingModule,
        CommonModule
    ],
    exports: [
    ],
    declarations: [
        MapLandComponent,
        ActionCellComponent,
        UserManualComponent,
    ],
    providers: [baseComponentProviders, NgbActiveModal],
})
export class LandModule { }