import { NgModule } from '@angular/core';
import { ResizeColumnDirective } from '@app/modules/core/directives/resize-column-table/resize-column.directive';
import { TrackByPropertyDirective } from '@app/modules/core/directives/track-by-property/track-by-property.directive';
import { TrimValueAccessorDirective } from '@app/modules/core/directives/trim-directive/trim.directive';

@NgModule({
    imports: [],
    exports: [TrimValueAccessorDirective,ResizeColumnDirective,TrackByPropertyDirective],
    declarations: [TrimValueAccessorDirective,ResizeColumnDirective,TrackByPropertyDirective],
    providers: [],
})
export class DirectivesModule { }
