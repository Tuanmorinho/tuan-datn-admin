import {ChangeDetectorRef, Component, Injector, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {BaseComponent} from '@app/modules/core/base/base.component';
import {ComponentService} from '@services/component.service';
import {AppHttpClient} from '@services/app-http.client.service';

@Component({
    selector: 'app-dashboard-index',
    templateUrl: './dashboard-index.component.html',
    styleUrls: ['./dashboard-index.component.scss']
})
export class DashboardIndexComponent extends BaseComponent implements OnInit, OnDestroy {
    totalOfCompany = 0;
    totalOfDepartment = 0;
    totalOfStaff = 0;
    totalOfForm = 0;
    totalOfDomLongThanh = 0;
    totalOfDomExternal = 0;
    @Input() ids: number[];
    isLoading = false;
    subscriptions: Subscription[] = [];
    requestService: any;

    constructor(protected service: ComponentService, private injector: Injector, protected httpClient: AppHttpClient, public ref: ChangeDetectorRef) {
        super(service);
    }

    ngOnInit(): void {
        this.ref.detectChanges();
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }
}
