import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapLandComponent } from './map/list/map.component';

const routes: Routes = [
  {
    path: 'map',
    children: [
      {
        path: 'view',
        component: MapLandComponent,
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
export class LandRoutingModule { }
