import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface DocumentModel extends BaseModel {
  name: string;
  code: string;
  departmentId: number;
  securityLevelId: number;
  usingPurposeDocument: number;
  fileMain: number;
  fileInvolved?: number;
  authorId: number;
  checkerId: number;
  duration?: number;
  permissions?: any;
  reviewStatus: number;
}
