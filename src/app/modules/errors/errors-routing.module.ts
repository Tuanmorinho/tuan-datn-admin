import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ErrorsComponent } from './errors.component';
import { Error1Component } from './error1/error1.component';

const routes: Routes = [
  {
    path: '',
    component: ErrorsComponent,
    children: [
      {
        path: 'error-1',
        component: Error1Component,
      },
      { path: '', redirectTo: 'error-1', pathMatch: 'full' },
      {
        path: '**',
        component: Error1Component,
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ErrorsRoutingModule {}
