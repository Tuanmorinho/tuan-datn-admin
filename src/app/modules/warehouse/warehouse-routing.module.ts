import { DetailCustomerComponent } from './customer/detail-customer/detail-customer.component';
import { CustomerComponent } from './../warehouse/customer/list/customer.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditCustomerComponent } from './customer/edit-customer/edit-customer.component';
import { SkuComponent } from './sku/list/sku.component';
import { ListSupplierComponent } from './supplier/list-supplier/list-supplier.component';
import { EditSupplierComponent } from './supplier/edit-supplier/edit-supplier.component';
import { DetailSupplierComponent } from './supplier/detail-supplier/detail-supplier.component';
import { EditSkuComponent } from './sku/edit-sku/edit-sku.component';
import { DetailSkuComponent } from './sku/detail-sku/detail-sku.component';
import { ListPOComponent } from './po/list-po/list-po.component';
import { CreatePOComponent } from './po/create-po/create-po.component';
import { DetailPOComponent } from './po/detail-po/detail-po.component';
import { ListSOComponent } from './SO/list-so/list-so.component';
import { EditSOComponent } from './SO/edit-so/edit-so.component';
import { DetailSOComponent } from './SO/detail-so/detail-so.component';
import { InventoryComponent } from './inventory/list/inventory.component';


const routes: Routes = [
  {
    path: 'sku',
    children: [
      {
        path: 'list',
        component: SkuComponent,
      },
      {
        path: 'add',
        component: EditSkuComponent,
      },
      {
        path: 'edit/:id',
        component: EditSkuComponent,
      },
      {
        path: 'detail/:id',
        component: DetailSkuComponent,
      },
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: '**', redirectTo: 'list', pathMatch: 'full' },
    ],
  },
  {
    path: 'customer',
    children: [
      {
        path: 'list',
        component: CustomerComponent,
      },
      {
        path: 'add',
        component: EditCustomerComponent
      },
      {
        path: 'edit/:id',
        component: EditCustomerComponent
      },
      {
        path: 'detail/:code/:id',
        component: DetailCustomerComponent,
      },
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: '**', redirectTo: 'list', pathMatch: 'full' },
    ],
  },
  {
    path: 'supplier',
    children: [
      {
        path: 'list',
        component: ListSupplierComponent,
      },
      {
        path: 'add',
        component: EditSupplierComponent,
      },
      {
        path: 'edit/:code',
        component: EditSupplierComponent,
      },
      {
        path: 'detail/:code/:id',
        component: DetailSupplierComponent,
      },
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: '**', redirectTo: 'list', pathMatch: 'full' },
    ],
  },
  {
    path: 'so',
    children: [
      {
        path: 'list',
        component: ListSOComponent,
      },
      {
        path: 'add',
        component: EditSOComponent,
      },
      {
        path: 'edit/:id/:orderKey',
        component: EditSOComponent,
      },
      {
        path: 'detail/:id/:orderKey',
        component: DetailSOComponent,
      },
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: '**', redirectTo: 'list', pathMatch: 'full' },
    ],
  },
  {
    path: 'inventory',
    children: [
      {
        path: 'list',
        component: InventoryComponent,
      },
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: '**', redirectTo: 'list', pathMatch: 'full' },
    ],
  },
  {
    path: 'po',
    children: [
        {
            path: 'list',
            component: ListPOComponent,
          },
          {
            path: 'add',
            component: CreatePOComponent,
          },
          {
            path: 'edit/:id/:receiptKey',
            component: CreatePOComponent,
          },
          {
            path: 'detail/:id/:receiptKey',
            component: DetailPOComponent,
          },
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: '**', redirectTo: 'list', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WarehouseRoutingModule { }
