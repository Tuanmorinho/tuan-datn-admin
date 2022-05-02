
export interface HeaderConfig {
    id: string;
    width?: number;
    rowspan?: number;
    colspan?: number
    title: string;
    background?:string;
    required?: boolean;
    isShowed?: boolean;
    subheaders?: HeaderConfig[];
}