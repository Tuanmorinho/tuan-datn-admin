
export interface CustomerModel {
  id: string,
  code: string,
  birthday: string,
  taxCode: boolean,
  email: boolean,
  name: string,
  phone: string,
  address: string,
  avatar?: {
    bucket: string,
    fileKey: string
  },
  whseId: string,
  storerKey: string,
}
