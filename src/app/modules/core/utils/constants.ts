import { ItemGroupModel } from "@app/modules/warehouse/sku/models/item-group.model";

export const ITEM_GROUP: ItemGroupModel[] = [
  { code: "X", name: "Xe" },
  { code: "MM", name: "Máy móc" },
  { code: "PB", name: "Phân bón" },
  { code: "TBVTV", name: "Thuốc bảo vệ thực vật" },
  { code: "GL", name: "Giống lúa" }
];

export const ROLES = {
  CTT: 'CTT',
  QLTT: 'QLTT',
  NLC: 'NLC',
  NQT: 'NQT'
}

export const PROVINCE = [
  {id: 4, value: 'An Giang'},
  {id: 5, value: 'Hà Nội'},
  {id: 6, value: 'Hải Phòng'},
  {id: 7, value: 'Thành phố Hồ Chí Minh'},
]

export const RELATIONSHIPS = [
  { name: 'Chủ hộ' },
  { name: 'Vợ' },
  { name: 'Chồng' },
  { name: 'Cha đẻ' },
  { name: 'Mẹ đẻ' },
  { name: 'Cha nuôi' },
  { name: 'Mẹ nuôi' },
  { name: 'Ông nội' },
  { name: 'Bà nội' },
  { name: 'Ông ngoại' },
  { name: 'Bà ngoại' },
  { name: 'Anh ruột' },
  { name: 'Chị ruột' },
  { name: 'Em ruột' },
  { name: 'Cháu ruột' },
  { name: 'Cụ nội' },
  { name: 'Cụ ngoại' },
  { name: 'Con đẻ' },
  { name: 'Con nuôi' },
  { name: 'Bác ruột' },
  { name: 'Chú ruột' },
  { name: 'Cậu ruột' },
  { name: 'Cô ruột' },
  { name: 'Dì ruột' },
  { name: 'Chắt ruột' },
  { name: 'Người giám hộ' },
  { name: 'Người ở nhờ' },
  { name: 'Người ở mượn' },
  { name: 'Người ở thuê' },
  { name: 'Người cùng ở nhờ' },
  { name: 'Người cùng ở thuê' },
  { name: 'Người cùng ở mượn' },
]
export const PO_TYPES = [
  { code: 1, name: 'Nhập trả hàng bán' },
  { code: 2, name: 'Nhập đơn hàng mua' },
  { code: 3, name: 'Nhập chuyển mã' },
  { code: 4, name: 'Nhập chuyển kho' },
]

export const PO_STATUS = [
  { code: 0, name: 'Tạo mới', style: 'new' },
  { code: 1, name: 'Đã hủy', style: 'cancelled' },
  { code: 2, name: 'Đã đóng', style: 'closed' },
  { code: 5, name: 'Đang nhập hàng', style: 'importing'  },
  { code: 9, name: 'Đã nhập hàng', style: 'imported' },
]

export const SO_TYPES = [
  { code: 1, name: 'Xuất đơn hàng bán' },
  { code: 2, name: 'Xuất trả nhà cc' },
  { code: 3, name: 'Xuất hủy' },
  { code: 4, name: 'Xuất hao hụt' },
  { code: 5, name: 'Xuất chuyển mã' },
  { code: 6, name: 'Xuất chuyển kho' },
]

export const SO_STATUS = [
  {
    code: 1,
    name: "Hủy",
    style: "cancel"
  },
  {
    code: 2,
    name: "Đóng",
    style: "closed"
  },
  {
    code: 4,
    name: "Mới",
    style: "new"
  },
  {
    code: 14,
    name: "Đang chỉ định",
    style: "assigning"
  },
  {
    code: 17,
    name: "Đã chỉ định",
    style: "specified"
  },
  {
    code: 52,
    name: "Đang soạn hàng",
    style: "preparing"
  },
  {
    code: 55,
    name: "Đã soạn hàng",
    style: "ordered"
  },
  {
    code: 72,
    name: "Đang sắp xếp",
    style: "arranging"
  },
  {
    code: 75,
    name: "Đã sắp xếp",
    style: "arranged"
  },
  {
    code: 82,
    name: "Đang đóng gói",
    style: "packing"
  },
  {
    code: 85,
    name: "Đã đóng gói",
    style: "packed"
  },
  {
    code: 92,
    name: "Đang chuyển hàng",
    style: "shipping"
  },
  {
    code: 95,
    name: "Đã chuyển hàng",
    style: "shipped"
  }
]
