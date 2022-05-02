import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailCarfComponent } from './detail-carf/detail-carf.component';
import { EditCarfComponent } from './edit-carf/edit-carf.component';
import { CarfComponent } from './list/carf.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        component: CarfComponent
      },
      {
        path: 'add',
        component: EditCarfComponent
      },
      {
        path: 'edit/:id',
        component: EditCarfComponent
      },
      {
        path: 'detail/:id',
        component: DetailCarfComponent
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
export class CarfRoutingModule { }
