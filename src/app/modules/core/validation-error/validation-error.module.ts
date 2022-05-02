import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ValidationErrorComponent } from './validation-error.component';
import {NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
    imports: [CommonModule, NgbAlertModule, TranslateModule],
    declarations: [ValidationErrorComponent],
    exports: [ValidationErrorComponent]
})
export class ValidationErrorModule { }
