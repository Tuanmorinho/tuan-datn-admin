export class BreadcrumbItemModel {
  title: string;
  linkText?: string;
  linkPath: string;
}

export interface BreadcrumbButtonModel {
  name: string;
  url?: string;
  queryParams?: any;
  class?: string;
  icon?: string;
  disable?: boolean;
  type?: string;
  isEvent?: boolean;
}

export interface EventModel {
  type: string;
  data: any;
}
