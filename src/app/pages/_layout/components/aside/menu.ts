import {
  MenuCategories,
  Permissions,
} from "@app/pages/_layout/components/aside/primay-aside";

export const Menu: MenuInterface[] = [
  {
    title: "Thống kê",
    name: MenuCategories.DASHBOARD,
    routers: ["dashboard"],
    url: "/dashboard",
    icon: './assets/media/svg/sidebar/dashboard.svg',
    subMenus: [],
  },
  {
    title: 'Quản trị hệ thống',
    name: MenuCategories.MANAGER,
    routers: ['system-admin'],
    icon: './assets/media/svg/sidebar/administrator.svg',
    url: '/',
    subMenus: [
      {
        title: 'Phân quyền vai trò',
        icon: '',
        routers: ['/system-admin/user-role'],
        url: '/system-admin/user-role/list',
        roles: [Permissions.manageUsers],
      },
      {
        title: 'Danh sách người dùng',
        icon: '',
        routers: ['/system-admin/users'],
        url: '/system-admin/users/list',
        roles: [Permissions.manageUsers],
      }
    ]
  },
  {
    title: 'Quản trị nông hộ',
    name: MenuCategories.MOL,
    routers: ['farm-management'],
    icon: './assets/media/svg/sidebar/household.svg',
    url: '',
    subMenus: [
      {
        title: 'Quản lý hộ gia đình',
        icon: '',
        routers: ['/farm-management/household'],
        url: '/farm-management/household/list',
      },
      {
        title: 'Quản lý hợp đồng canh tác',
        icon: '',
        routers: ['/farm-management/farming-contract'],
        url: '/farm-management/farming-contract',
      },
    ]
  },
  {
    title: 'Quản trị kho',
    name: MenuCategories.MAM  ,
    routers: ['warehouse'], 
    icon: './assets/media/svg/sidebar/warehouse.svg',
    url: '',
    subMenus: [
      {
        title: 'Danh mục vật tư',
        icon: '',
        routers: ['/warehouse/sku'],
        url: '/warehouse/sku/list',
        roles: [Permissions.manageUsers],
      },
      {
        title: 'Danh mục nhà cung cấp',
        icon: '',
        routers: ['/warehouse/supplier'],
        url: '/warehouse/supplier/list',
        roles: [Permissions.manageUsers],
      },
      {
        title: 'Danh mục khách hàng',
        icon: '',
        routers: ['/warehouse/customer'],
        url: '/warehouse/customer/list',
        roles: [Permissions.manageUsers],
      },
      {
        title: 'Danh sách phiếu xuất kho',
        icon: '',
        routers: ['/warehouse/so'],
        url: '/warehouse/so/list',
        roles: [Permissions.manageUsers],
      },
      {
        title: 'Danh sách phiếu nhập kho',
        icon: '',
        routers: ['/warehouse/po'],
        url: '/warehouse/po/list',
        roles: [Permissions.manageUsers],
      },
      {
        title: 'Danh sách tồn kho',
        icon: '',
        routers: ['/warehouse/inventory'],
        url: '/warehouse/inventory/list',
        roles: [Permissions.manageUsers],
      }
    ]
  },
  {
    title: 'Quản trị đất đai',
    name: MenuCategories.REES,
    routers: ['land'], 
    icon: './assets/media/svg/sidebar/land.svg',
    url: '',
    subMenus: [
      {
        title: 'Bản đồ số nông nghiệp',
        icon: '',
        routers: ['/land/map/view'],
        url: '/land/map/view',
      }
    ]
  },
  {
    title: 'Cài đặt',
    name: MenuCategories.SET,
    routers: ['dashboard'],
    url: '/dashboard',
    subMenus: []
  },
  {
    title: 'Thông báo',
    name: MenuCategories.NOTICE,
    routers: ['dashboard'],
    url: '/dashboard',
    subMenus: []
  },
];

interface MenuInterface {
  title: string;
  name?: string;
  icon?: string;
  routers: string[];
  url: string;
  queryParams?: object;
  roles?: string[];
  subMenus?: MenuInterface[];
}
