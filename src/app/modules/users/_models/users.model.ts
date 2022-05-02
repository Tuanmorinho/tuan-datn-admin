import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface UsersModel extends BaseModel {
  id: string;
  fullName: string;
  title: string;
  time_display: string;
  creater: string;
  created_at: string;
  status: string;
  userState: number;
  statusUser: UsersModel;
  pregnancy: boolean;
  probationary: boolean;
  isOnLeave: boolean;
  isResignation: boolean;
  email: string;
  username: string;
  realmRoles: [];
  enabled: boolean;
}
