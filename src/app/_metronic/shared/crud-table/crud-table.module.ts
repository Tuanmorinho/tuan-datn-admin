import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { NgPagination } from './components/paginator/ng-pagination/ng-pagination.component';
import { FormsModule } from '@angular/forms';
import { SortIconComponent } from './components/sort-icon/sort-icon.component';
import { InlineSVGModule } from 'ng-inline-svg';
import { StatusCellComponent } from './components/status-cell/status-cell.component';
@NgModule({
  declarations: [PaginatorComponent, NgPagination, SortIconComponent, StatusCellComponent],
  imports: [CommonModule, FormsModule, InlineSVGModule  ],
  exports: [PaginatorComponent, NgPagination, SortIconComponent, StatusCellComponent],
})
export class CRUDTableModule { }
