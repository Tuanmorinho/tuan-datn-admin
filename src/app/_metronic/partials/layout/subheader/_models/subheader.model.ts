import { BreadcrumbButtonModel, BreadcrumbItemModel } from './breadcrumb-item.model';

export class SubheaderModel {
  breadcrumbs: BreadcrumbItemModel[] = [];
  title = '';
  breadcrumbsBtn: BreadcrumbButtonModel[] = [];
}
