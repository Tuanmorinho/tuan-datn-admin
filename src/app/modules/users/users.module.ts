import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioModule } from '@angular/material/radio';
import { CRUDTableModule } from '@app/_metronic/shared/crud-table';
import { NgbActiveModal, NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg';
import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './list/users.component';
import { EditUsersComponent } from './edit-users/edit-users.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { TableModule } from '@app/modules/core/table/table.module';
import { ValidationErrorModule } from '../core/validation-error/validation-error.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { baseComponentProviders } from '@app/modules/core/base/base.component';
import { DirectivesModule } from '@app/modules/core/directives/directives.module';
import { ActionCellComponent } from './components/action-cell/action-cell.component';
import { DetailUserComponent } from './detail-user/detail-user.component';
import { ReusableComponentsModule } from '@app/modules/core/reusable-components/reusable-components.module';
import { MatChipsModule } from '@angular/material/chips';
import { PipesModule } from '@app/pipes/pipes.module';
import { MatIconModule } from '@angular/material/icon';
import { DetailCellComponent } from './components/detail-cell/detail-cell.component';
import { UserRoleComponent } from './user-role/list/user-role.component';
import { EditUserRoleComponent } from './user-role/edit-user-role/edit-user-role.component';
import { HistoryUserComponent } from './components/history-user/history-user.component';

@NgModule({
    imports: [
        CommonModule,
        UsersRoutingModule,
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
        MatChipsModule,
        MatIconModule,
        NgSelectModule,
        DirectivesModule,
        FlashMessagesModule.forRoot(),
        ReusableComponentsModule,
        PipesModule,
    ],
    exports: [
    ],
    declarations: [
        UsersComponent,
        EditUsersComponent,
        ActionCellComponent,
        DetailUserComponent,
        UserRoleComponent,
        EditUserRoleComponent,
        DetailCellComponent,
        HistoryUserComponent
    ],
    providers: [baseComponentProviders, NgbActiveModal],
})
export class UsersModule { }
