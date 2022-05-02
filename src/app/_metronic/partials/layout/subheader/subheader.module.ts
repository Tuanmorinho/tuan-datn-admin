import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InlineSVGModule } from 'ng-inline-svg';
import { Subheader1Component } from './subheader1/subheader1.component';
import { SubheaderWrapperComponent } from './subheader-wrapper/subheader-wrapper.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { DropdownMenusModule } from '../../content/dropdown-menus/dropdown-menus.module';

@NgModule({
  declarations: [
    Subheader1Component,
    SubheaderWrapperComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    InlineSVGModule,
    NgbDropdownModule,
    DropdownMenusModule,
  ],
  exports: [SubheaderWrapperComponent],
})
export class SubheaderModule { }
