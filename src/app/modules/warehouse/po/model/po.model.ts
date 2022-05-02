import { BaseModel } from "@app/_metronic/shared/crud-table";

export interface POModel extends BaseModel {
  id: string;
  receiptKey: string;
  code: string;
  type: string;
  note: string;
  status: string;
  supplierCode: string;
  supplierName: string;
  createdDate: string;
  expectedReceiptDate: string;
  priceCurrencyType: string;
  items?: ItemPOModel[]
}

export interface ItemPOModel {
  code: string;
  conditionCode: string;
  id: string;
  name: string;
  qty: string;
  status: string;
  unit: string;
  unitPrice: number;
}
