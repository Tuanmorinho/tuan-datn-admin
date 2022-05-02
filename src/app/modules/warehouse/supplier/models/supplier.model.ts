export interface SupplierModel {
  id?: string;
  whseId: string;
  storerKey: string;
  code: string;
  taxCode: string;
  email: string;
  phone: string;
  address: string;
  name: string;
  logo: {
    bucket: string;
    fileKey: string;
  };
  groupCodes?: any;
  groupName?: any;
}
