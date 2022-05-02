import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { UploadFilesComponent } from '@app/modules/core/reusable-components/upload-files/upload-files.component';
import { NgbAlertModule, NgbPopoverModule, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { ValidationErrorModule } from '../validation-error/validation-error.module';
import { PermissionDetailComponent } from './components/permission-detail/permission-detail.component';
import { PermissionFieldComponent } from './components/permission-field/permission-field.component';
import { DateCellComponent } from './components/date-cell/date-cell.component';
import { InlineSVGModule } from 'ng-inline-svg';
import { PermissionCellComponent } from '@app/modules/core/reusable-components/components/permission-cell/permission-cell.component';
import { PipesModule } from '@app/pipes/pipes.module';
import { AutoCompleteComponent } from '@app/modules/core/reusable-components/autocomplete/autocomplete.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { OwlDatetimeFormArrayComponent } from '@app/modules/core/reusable-components/components/owl-datetime/form-array/owl-datetime.component';
import { OwlDateTimeModule } from 'ng-pick-datetime';
import { InfoPopoverComponent } from '@app/modules/core/reusable-components/info-popover/info-popover.component';
import { OwlYearMonthComponent } from '@app/modules/core/reusable-components/components/owl-datetime/owl-year-month/owl-year-month.component';
import { NgSelectMultipleComponent } from '@app/modules/core/reusable-components/components/ngselect-multiple/ngselect-multiple.component';
import { AddressComponent } from './address/address.component';
import { UserInfoComponent } from './user-infor/user-info.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MapComponent } from '@app/modules/core/reusable-components/map/map.component';
import { MousePositionComponent } from './map/mouse-position/mouse-position.component';
import { ScalelineComponent } from './map/scaleline/scaleline.component';
import { TableModule } from '../table/table.module';
import { ActionExcelCellComponent } from './excel-sheet/components/action-excel-cell/action-excel-cell.component';
import { CustomOffcanvasComponent } from './offcanvas/custom/custom-offcanvas.component';
import { SelectionModalModule } from '../selection-modal/selection-modal.module';

import { ExcelSheetComponent } from './excel-sheet/excel-sheet.component';
import { WeatherInfoComponent } from './weather-info/weather-info.component';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
@NgModule({
    imports: [
        CommonModule,
        TableModule,
        FormsModule,
        NgbProgressbarModule,
        ValidationErrorModule,
        NgSelectModule,
        MatIconModule,
        MatChipsModule,
        ReactiveFormsModule,
        OwlDateTimeModule,
        InlineSVGModule,
        PipesModule,
        NgbPopoverModule,
        MatDatepickerModule,
        MatRadioModule,
        MatCheckboxModule,
        SelectionModalModule
    ],
    exports: [
        UploadFilesComponent,
        AutoCompleteComponent,
        PermissionFieldComponent,
        PermissionDetailComponent,
        DateCellComponent,
        PermissionCellComponent,
        OwlDatetimeFormArrayComponent,
        InfoPopoverComponent,
        OwlYearMonthComponent,
        NgSelectMultipleComponent,
        AddressComponent,
        UserInfoComponent,
        MapComponent,
        ExcelSheetComponent,
        CustomOffcanvasComponent
    ],
    declarations: [
        UploadFilesComponent,
        AutoCompleteComponent,
        PermissionFieldComponent,
        PermissionDetailComponent,
        DateCellComponent,
        PermissionCellComponent,
        OwlDatetimeFormArrayComponent,
        InfoPopoverComponent,
        OwlYearMonthComponent,
        NgSelectMultipleComponent,
        AddressComponent,
        UserInfoComponent,
        MapComponent,
        MousePositionComponent,
        ScalelineComponent,
        ExcelSheetComponent,
        ActionExcelCellComponent,
        CustomOffcanvasComponent,
        WeatherInfoComponent,
        ConfirmModalComponent
    ],
    providers: [],
})
export class ReusableComponentsModule { }
