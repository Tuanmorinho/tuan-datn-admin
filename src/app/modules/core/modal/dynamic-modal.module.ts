import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicModalComponent } from '@app/modules/core/modal/component/dynamic-modal.component';
import { DynamicFormModule } from '@app/modules/form/form.module';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        DynamicFormModule,
        HttpClientModule,
        NgbModalModule,
    ],
    exports: [DynamicModalComponent],
    declarations: [
        DynamicModalComponent
    ],
    providers: [],
})
export class DynamicModalModule { }
