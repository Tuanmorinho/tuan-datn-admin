import { ActionCellSkuComponent } from './sku/components/action-cell-sku/action-cell-sku.component';
import { DetailCustomerComponent } from './customer/detail-customer/detail-customer.component';
import { EditCustomerComponent } from './customer/edit-customer/edit-customer.component';
import { DetailCellCustomerComponent } from './customer/components/detail-cell-customer/detail-cell-customer.component';
import { ActionCellCustomerComponent } from './customer/components/action-cell-customer/action-cell-customer.component';
import { CustomerComponent } from './../warehouse/customer/list/customer.component';
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
import { MatIconModule } from '@angular/material/icon';
import { WarehouseRoutingModule } from './warehouse-routing.module';
import { SkuComponent } from './sku/list/sku.component';
import { DetailCellSkuComponent } from './sku/components/detail-cell-sku/detail-cell-sku.component';
import { DetailSkuComponent } from './sku/detail-sku/detail-sku.component';
import { EditSkuComponent } from './sku/edit-sku/edit-sku.component';
import { EditFertilizerPesticideComponent } from './sku/edit-sku/components/edit-fertilizer-pesticide/edit-fertilizer-pesticide.component';
import { EditMachinesVehiclesComponent } from './sku/edit-sku/components/edit-machines-vehicles/edit-machines-vehicles.component';
import { ListSupplierComponent } from './supplier/list-supplier/list-supplier.component';
import { EditSupplierComponent } from './supplier/edit-supplier/edit-supplier.component';
import { DetailSupplierComponent } from './supplier/detail-supplier/detail-supplier.component';
import { ActionCellSupplierComponent } from './supplier/components/action-cell-supplier/action-cell-supplier.component';
import { DetailCellSupplierComponent } from './supplier/components/detail-cell-supplier/detail-cell-supplier.component';
import { ListPOComponent } from './po/list-po/list-po.component';
import { CreatePOComponent } from './po/create-po/create-po.component';
import { DetailPOComponent } from './po/detail-po/detail-po.component';
import { ActionCellPOComponent } from './po/components/action-cell/action-cell.component';
import { DetailCellPOComponent } from './po/components/detail-cell/detail-cell.component';
import { EditRiceSeedsComponent } from './sku/edit-sku/components/edit-rice-seeds/edit-rice-seeds.component';
import { InventoryComponent } from './inventory/list/inventory.component';
import { ListSOComponent } from './SO/list-so/list-so.component';
import { EditSOComponent } from './SO/edit-so/edit-so.component';
import { DetailSOComponent } from './SO/detail-so/detail-so.component';
import { DetailCellSOComponent } from './SO/components/detail-cell-so/detail-cell-so.component';
import { ActionCellSOComponent } from './SO/components/action-cell-so/action-cell-so.component';


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
        NgSelectModule,
        DirectivesModule,
        FlashMessagesModule.forRoot(),
        ReusableComponentsModule,
        WarehouseRoutingModule,
    ],
    exports: [
    ],
    declarations: [
        CustomerComponent,
        EditCustomerComponent,
        DetailCustomerComponent,
        ActionCellCustomerComponent,
        DetailCellCustomerComponent,
        SkuComponent,
        DetailCellSkuComponent,
        ActionCellSkuComponent,
        DetailSkuComponent,
        EditSkuComponent,
        EditFertilizerPesticideComponent,
        EditMachinesVehiclesComponent,

        ListSupplierComponent,
        EditSupplierComponent,
        DetailSupplierComponent,
        ActionCellSupplierComponent,
        DetailCellSupplierComponent,
        EditRiceSeedsComponent,
        InventoryComponent,

        ListSOComponent,
        EditSOComponent,
        DetailSOComponent,
        DetailCellSOComponent,
        ActionCellSOComponent,

        ListPOComponent,
        CreatePOComponent,
        DetailPOComponent,
        ActionCellPOComponent,
        DetailCellPOComponent
    ],
    providers: [baseComponentProviders, NgbActiveModal],
})
export class WarehouseModule { }