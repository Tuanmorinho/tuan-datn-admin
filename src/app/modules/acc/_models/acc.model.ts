import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface ACCModel extends BaseModel {
  code: string;
  softwareId: number;
  typeSettingId: number;
  rangeSettingId: number;
  rangeSettingDetailId: number;
  ticket: string;
  typeDocumentId: number;
  licenseNumber: string;
  dateContent: string;
  contentIncorrect: string;
  contentCorrective: string;
}
