import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HouseHoldCreateComponent } from './household/create/create.component';
import { ListComponent } from './household/list/list.component';
import { EditFarmingContractsComponent } from './farming-contracts/edit-farming-contracts/edit-farming-contracts.component';
import { ListFarmingContractsComponent } from './farming-contracts/list-farming-contracts/list-farming-contracts.component';
import { DetailFarmingContractsComponent } from './farming-contracts/detail-farming-contracts/detail-farming-contracts.component';
import { HouseHoldEditComponent } from './household/edit/edit.component';
import { HouseHoldDetailComponent } from './household/detail/detail.component';

const routes: Routes = [
  {
    path: 'household',
    children: [
      {
        path: 'list',
        component: ListComponent
      },
      {
        path: 'add',
        component: HouseHoldCreateComponent,
      },
      {
        path: 'edit/:id',
        component: HouseHoldEditComponent,
      },
      {
        path: 'detail/:id',
        component: HouseHoldDetailComponent,
      },
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: '**', redirectTo: 'list', pathMatch: 'full' },
    ],
  },
  {
    path: 'farming-contract',
    children: [
      {
        path: 'list',
        component: ListFarmingContractsComponent
      },
      {
        path: 'add',
        component: EditFarmingContractsComponent,
      },
      {
        path: 'edit/:id',
        component: EditFarmingContractsComponent,
      },
      {
        path: 'detail/:id',
        component: DetailFarmingContractsComponent,
      },
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: '**', redirectTo: 'list', pathMatch: 'full' },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FarmManagementRoutingModule { }
