import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface RoleModel extends BaseModel {
  id: string,
  name: string,
  description: string,
  composite: boolean,
  clientRole: boolean,
  containerId: string
}