import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioModule } from '@angular/material/radio';
import { CRUDTableModule } from '@app/_metronic/shared/crud-table';
import { NgbActiveModal, NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { TableModule } from '@app/modules/core/table/table.module';
import { ValidationErrorModule } from '../core/validation-error/validation-error.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { baseComponentProviders } from '@app/modules/core/base/base.component';
import { DirectivesModule } from '@app/modules/core/directives/directives.module';
import { ReusableComponentsModule } from '@app/modules/core/reusable-components/reusable-components.module';
import { MatChipsModule } from '@angular/material/chips';
import { PipesModule } from '@app/pipes/pipes.module';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ListComponent } from './household/list/list.component';
import { HouseHoldCreateComponent } from './household/create/create.component';
import { FarmManagementRoutingModule } from './farm-management-routing.module';
import { HouseHoldDetailcellComponent } from './household/components/detail-cell/detail-cell.component';
import { HouseHoldActionCellComponent } from './household/components/action-cell/action-cell.component';
import { HouseHoldItemComponent } from './household/components/house-hold-item/house-hold-item.component';
import { MemberComponent } from './household/components/member-component/member-component.component';
import { EditFarmingContractsComponent } from './farming-contracts/edit-farming-contracts/edit-farming-contracts.component';
import { ListFarmingContractsComponent } from './farming-contracts/list-farming-contracts/list-farming-contracts.component';
import { DetailFarmingContractsComponent } from './farming-contracts/detail-farming-contracts/detail-farming-contracts.component';
import { DetailCellFarmingContractsComponent } from './farming-contracts/components/detail-cell-farming-contracts/detail-cell-farming-contracts.component';
import { FarmingContractActionCellComponent } from './farming-contracts/components/action-cell/action-cell.component';
import { StatusSlideCellComponent } from './household/components/status-slide-cell/status-slide-cell.component';
import { HouseHoldEditComponent } from './household/edit/edit.component';
import { HouseHoldDetailComponent } from './household/detail/detail.component';
import { PlotsOfFieldComponent } from './household/components/plots-of-field/plots-of-field.component';
import { DetailMemberComponent } from './household/components/detail-member/detail-member.component';

@NgModule({
    imports: [
        CommonModule,
        TableModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        InlineSVGModule,
        CRUDTableModule,
        MatRadioModule,
        MatExpansionModule,
        MatCheckboxModule,
        NgbModalModule,
        ValidationErrorModule,
        MatDatepickerModule,
        NgbDatepickerModule,
        MatMomentDateModule,
        MatIconModule,
        MatSlideToggleModule,
        MatChipsModule,
        NgSelectModule,
        DirectivesModule,
        FlashMessagesModule.forRoot(),
        ReusableComponentsModule,
        PipesModule,
        FarmManagementRoutingModule,
    ],
    exports: [
    ],
    declarations: [
        ListComponent,
        HouseHoldCreateComponent,
        HouseHoldEditComponent,
        HouseHoldItemComponent,
        HouseHoldDetailcellComponent,
        HouseHoldActionCellComponent,
        EditFarmingContractsComponent,
        ListFarmingContractsComponent,
        HouseHoldDetailComponent,
        PlotsOfFieldComponent,
        MemberComponent,
        DetailFarmingContractsComponent,
        DetailCellFarmingContractsComponent,
        FarmingContractActionCellComponent,
        StatusSlideCellComponent,
        DetailMemberComponent
    ],
    providers: [baseComponentProviders, NgbActiveModal],
})
export class FarmManagementModule { }
