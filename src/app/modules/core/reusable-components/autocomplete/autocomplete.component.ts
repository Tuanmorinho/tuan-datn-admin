import { HttpClient } from "@angular/common/http";
import { Component, forwardRef, ChangeDetectionStrategy, ChangeDetectorRef, Input, Output, EventEmitter } from "@angular/core";
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormGroup, FormBuilder } from "@angular/forms";
import { ResponseModel } from "@app/modules/core/model/response-model";
import { TermsModel } from "@app/modules/core/model/terms.model";
import { Observable } from "rxjs";

export interface IAutocomplete {
    outputSearch: EventEmitter<TermsModel>;
    ourputScrollToEnd: EventEmitter<TermsModel>;
    outputClear: EventEmitter<any>;
    outputRemove: EventEmitter<any>;

    formGroup: FormGroup;
    formControlName: string;
    items: any[];
    placeholder: string;
    notFoundText: string;
    label: string;
    value: string;
    appendTo: string;
    tagText: string;
    multi: boolean;

}

@Component({
    selector: 'app-autocomplete',
    templateUrl: './autocomplete.component.html',
    styleUrls: ['./autocomplete.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => AutoCompleteComponent),
            multi: true
        },
        // {
        //     provide: AutoCompleteService,
        //     useFactory: (component: AutoCompleteComponent, http: AppHttpClient, httpClient: HttpClient) => {
        //         return new AutoCompleteService(http, httpClient);
        //     },
        //     deps: [AutoCompleteComponent, AppHttpClient],
        //     multi: true
        // }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutoCompleteComponent implements ControlValueAccessor, IAutocomplete {
    @Output() outputSearch: EventEmitter<any> = new EventEmitter();
    @Output() ourputScrollToEnd: EventEmitter<any> = new EventEmitter();
    @Output() outputClear: EventEmitter<any> = new EventEmitter();
    @Output() outputRemove: EventEmitter<any> = new EventEmitter();

    @Input() items: any[] = [];
    @Input() placeholder: string = 'Chọn';
    @Input() notFoundText: string = 'Không có bản ghi nào';
    @Input() label: string = 'name';
    @Input() value: string = 'id';
    @Input() appendTo: string = null;
    @Input() tagText: string = 'Thêm';
    @Input() multi: boolean = false;

    @Input() formControlName: string
    @Input() formGroup: FormGroup;

    currentPage: number = 1;
    totalItems: number;
    disableFetchApi: boolean = false;
    term: string = '';
    isLoading$: Observable<boolean>;

    constructor(public ref: ChangeDetectorRef) {

    }

    ngOnInit(): void {
    }


    onChange(event) {
    }

    onTouched() { }

    writeValue(files: any): void {
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    search(event) {
        this.resetData();
        let terms: TermsModel = {
            terms: event.term,
            currentPage: this.currentPage
        }
        this.term = event.term;
        this.outputSearch.emit(terms);
        this.searchAsset(terms)
    }

    scrollToEnd(event) {
        if (this.disableFetchApi) return;

        ++this.currentPage;
        let terms: TermsModel = {
            terms: this.term,
            currentPage: this.currentPage
        }
        this.ourputScrollToEnd.emit(terms);
        this.searchAsset(terms)

    }

    clear(event) {
        this.outputClear.emit(event);
        this.resetData();
        this.searchAsset();
    }

    remove(event) {
        this.outputRemove.emit(event);
    }

    add(event) {
        if (!event?.id) {
            
        }
    }

    searchAsset(terms?: TermsModel) {
        if (!terms) {
            terms = {
                terms: '',
                currentPage: 1
            }
        }
    }

    resetData() {
        this.currentPage = 1;
        this.disableFetchApi = false;
        this.items = [];
        this.items.length = 0;
    }

}