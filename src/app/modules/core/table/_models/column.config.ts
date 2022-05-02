import { Type } from "@angular/core";

export interface ColumnConfig {
    label: string;
    subLabels?: SubLabel[];
    subLabelsNoData?: subLabelsNoData[];
    dataKey: string;
    width?: number;
    minWidth?: number;
    fixedColumn?: boolean;
    sort: boolean;
    isShowed?: boolean;
    component?: Type<any>;
    type?: string;
    predict?: (query: any) => any; 
}

export interface SubLabel{
    label: string;
    dataKey: string;
    field?: string;
    width?: string;
    component?: Type<any>;
    predict?: (query: any) => any;
}

interface subLabelsNoData{
    label: string;
    width?: string;
}