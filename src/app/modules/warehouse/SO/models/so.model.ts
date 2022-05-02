import { BaseModel } from "@app/_metronic/shared/crud-table";

export interface SOModel extends BaseModel {
  orderKey: string;
  code: string;
  status: string;
  type: string;
  customerCode: string;
  customerName: string;
  customerAddress: string;
  requestedQty: number;
  shippedQty: number;
  requestedShipDate: string;
  actualShipDate: string;
  createdDate: string;
  note: string;
  priceCurrencyType: string;
  items?: ItemSOModel[]
}

export interface ItemSOModel {
  code: string;
  conditionCode: string;
  id: string;
  name: string;
  qty: string;
  status: string;
  unit: string;
  unitPrice: number;
}