import { Directive, forwardRef, HostListener } from "@angular/core";
import { DefaultValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
const TRIM_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TrimValueAccessorDirective),
    multi: true
};
/**
 * The trim accessor for writing trimmed value and listening to changes that is
 * used by the {@link NgModel}, {@link FormControlDirective}, and
 * {@link FormControlName} directives.
 */
@Directive({
    // tslint:disable-next-line:directive-selector
    selector: "[appTrim]",
    providers: [TRIM_VALUE_ACCESSOR]
})
export class TrimValueAccessorDirective extends DefaultValueAccessor {
    @HostListener("input", ["$event.target.value"])
    ngOnChange = (val: string) => {        
        this.onChange(val.trim());
    };
    @HostListener("blur", ["$event.target.value"])
    applyTrim(val: string) {
        this.writeValue(val.trim());
    }
    writeValue(value: any): void {
        if (typeof value === "string") {
            value = value.trim();
        }
        super.writeValue(value);
    }
}