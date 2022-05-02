import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorComponent } from './editor.component';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { baseComponentProviders } from '../base/base.component';

@NgModule({
  declarations: [EditorComponent],
  imports: [
    CommonModule,
    EditorModule
  ],
  exports: [EditorComponent],
  providers: [baseComponentProviders, { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }],
})
export class TextEditorModule { }
