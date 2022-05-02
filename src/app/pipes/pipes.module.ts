import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { AbbreviationUserPipe } from '@app/pipes/abbreviation-user.pipe';
import { CheckboxTablePipe } from '@app/pipes/checkbox-table.pipe';
import { ControlInFormArrPipe } from '@app/pipes/control-in-form-array.pipe';
import { DateFilterPipe } from '@app/pipes/date-filter.pipe';
import { FilterFileDeletedPipe } from '@app/pipes/filter-file-deleted.pipe';
import { SafeHtmlPipe } from '@app/pipes/safe-html.pipe';


@NgModule({
    imports: [CommonModule],
    providers: [DatePipe],
    exports: [SafeHtmlPipe, CheckboxTablePipe, FilterFileDeletedPipe, AbbreviationUserPipe, ControlInFormArrPipe, DateFilterPipe],
    declarations: [SafeHtmlPipe, CheckboxTablePipe, FilterFileDeletedPipe, AbbreviationUserPipe, ControlInFormArrPipe, DateFilterPipe],
})
export class PipesModule { }
