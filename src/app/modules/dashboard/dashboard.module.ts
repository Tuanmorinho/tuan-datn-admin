import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {DirectivesModule} from '@app/modules/core/directives/directives.module';
import {SelectionModalModule} from '@app/modules/core/selection-modal/selection-modal.module';
import {TableModule} from '@app/modules/core/table/table.module';
import {ValidationErrorModule} from '@app/modules/core/validation-error/validation-error.module';
import {CRUDTableModule} from '@app/_metronic/shared/crud-table';
import {NgSelectModule} from '@ng-select/ng-select';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {InlineSVGModule} from 'ng-inline-svg';
import {AlertFlashModule} from '../core/_alert/alert-flash.module';
import {DashboardIndexComponent} from '@app/modules/dashboard/home/dashboard-index.component';
import {DashboardRoutingModule} from '@app/modules/dashboard/dashboard-routing.module';
import {DashboardsModule} from '@app/_metronic/partials/content/dashboards/dashboards.module';
import { ReusableComponentsModule } from '@app/modules/core/reusable-components/reusable-components.module';


@NgModule({
    imports: [
        CommonModule,
        CRUDTableModule,
        DashboardRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        InlineSVGModule,
        CRUDTableModule,
        TableModule,
        SelectionModalModule,
        ValidationErrorModule,
        NgSelectModule,
        AlertFlashModule,
        NgxDatatableModule,
        DirectivesModule,
        MatCheckboxModule,
        DashboardsModule,
        ReusableComponentsModule
    ],
    exports: [
    ],
    declarations: [DashboardIndexComponent],
    providers: [],
})
export class DashboardModule { }
