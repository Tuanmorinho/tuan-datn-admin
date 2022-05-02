import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface CarfModel extends BaseModel {
  code: string;
  name: string;
  description: string;
  files: any[]
}
