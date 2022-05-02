import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailACCComponent } from './detail-acc/detail-acc.component';
import { EditACCComponent } from './edit-acc/edit-acc.component';
import { ACCComponent } from './list/acc.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        component: ACCComponent
      },
      {
        path: 'add',
        component: EditACCComponent
      },
      {
        path: 'edit/:id',
        component: EditACCComponent
      },
      {
        path: 'detail/:id',
        component: DetailACCComponent
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
export class ACCRoutingModule { }
