import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';
import { LayoutService } from '../../../../core';
import { SubheaderService } from '../_services/subheader.service';
import { BreadcrumbButtonModel, BreadcrumbItemModel } from '../_models/breadcrumb-item.model';

@Component({
  selector: 'app-subheader1',
  templateUrl: './subheader1.component.html',
  styleUrls:['./subheader1.component.scss']
})
export class Subheader1Component implements OnInit {
  subheaderCSSClasses = '';
  subheaderContainerCSSClasses = '';
  subheaderMobileToggle = false;
  subheaderDisplayDesc = false;
  title$: Observable<string>;
  breadcrumbsBtn$: Observable<BreadcrumbButtonModel[]>;
  breadcrumbs$: Observable<BreadcrumbItemModel[]>;
  breadcrumbs: BreadcrumbItemModel[] = [];
  description$: Observable<string>;
  descriptionStyled$: Observable<string>;
  @Input() title: string;
  _submitted: boolean;
  get submitted() {
    return this._submitted;
  }
  set submitted(val) {
      this._submitted = val;
  }
  constructor(
    private layout: LayoutService,
    private subheader: SubheaderService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.title$ = this.subheader.titleSubject.asObservable();
    this.breadcrumbsBtn$ = this.subheader.breadcrumbsBtn.asObservable();
    this.breadcrumbs$ = this.subheader.breadCrumbsSubject.asObservable();
    this.description$ = this.subheader.descriptionSubject.asObservable();
    this.descriptionStyled$ = this.subheader.descriptionStyledSubject.asObservable();
    this.subheaderCSSClasses = this.layout.getStringCSSClasses('subheader');
    this.subheaderContainerCSSClasses = this.layout.getStringCSSClasses(
      'subheader_container'
    );
    this.subheaderMobileToggle = this.layout.getProp('subheader.mobileToggle');
    this.subheaderDisplayDesc = this.layout.getProp('subheader.displayDesc');

    this.breadcrumbs$.subscribe((res) => {
      this.breadcrumbs = res;
      this.cdr.detectChanges();
    });
    this.title$.subscribe((res) => {
      this.title = res;
    });
  }

  eventClick(type: string) {
    this.subheader.eventEmit.emit(type);
  }
}
