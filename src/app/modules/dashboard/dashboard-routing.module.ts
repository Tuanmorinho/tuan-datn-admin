import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardIndexComponent} from '@app/modules/dashboard/home/dashboard-index.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: DashboardIndexComponent
      },
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule { }
