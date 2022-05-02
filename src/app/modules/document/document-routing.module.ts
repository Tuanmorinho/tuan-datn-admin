import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocumentComponent } from '@app/modules/document/list-document/document.component';
import { DetailDocumentComponent } from './detail-document/detail-document.component';

const routes: Routes = [
  {
    path: '',
    // component: DocumentBaseComponent,
    children: [
      {
        path: 'list',
        component: DocumentComponent
      },
      {
        path: 'deleted',
        component: DocumentComponent
      },
      {
        path: 'detail/:id',
        component: DetailDocumentComponent
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
export class DocumentRoutingModule { }
