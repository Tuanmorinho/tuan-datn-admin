import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlertFlashComponent } from './alert-flash.component';
import {NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
    imports: [CommonModule, NgbAlertModule, TranslateModule],
    declarations: [AlertFlashComponent],
    exports: [AlertFlashComponent]
})
export class AlertFlashModule { }
