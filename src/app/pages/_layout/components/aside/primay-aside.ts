export enum MenuCategories {
    MANAGER = 'MANAGER',
    UNKNOWN = 'UNKNOWN',
    DASHBOARD = 'DASHBOARD',
    MOL = 'MANAGEROWNEDLAND',
    MAM = 'MANAGERAGRICULTURALMATERIALS',
    WHS = 'WAREHOUSES',
    WET = 'WEATHER',
    REES = 'REALESTATE',
    PROD = 'PRODUCTION',
    REPORT = 'REPORT',
    COMMERCE = 'COMMERCE',
    SET = 'SETTING',
    NOTICE = 'NOTIFICATION'
}

export enum Permissions {
  manageUsers = "manage-users",
  viewDefault = "viewDefault",
  viewMasterData = "viewMasterData",
  viewUtility = "viewUtility",
  viewVendorPortal = "viewVendorPortal",
}

export const PrimaryAside: PrimaryAsideInterface[] = [

    {
        tooltip: 'Dashboard',
        name: MenuCategories.DASHBOARD,
        icon: './assets/media/svg/icons/Common/Dashboard.svg',
        url: '/dashboard',
    },
    {
        tooltip: 'Người quản lý',
        name: MenuCategories.MANAGER,
        icon: './assets/media/svg/icons/Common/Users.svg',
        url: '/users',
        roles: [Permissions.manageUsers],
    },
    {
        tooltip: 'Quản trị nông hộ',
        name: MenuCategories.MOL,
        icon: './assets/media/svg/icons/Common/MapPin.svg',
        url: '/household',
        roles: [Permissions.viewDefault]
    },
    {
        tooltip: 'Quản trị vật tư nông nghiệp',
        name: MenuCategories.MAM,
        icon: './assets/media/svg/icons/Common/Agriculture.svg',
        url: '/warehouse',
        roles: [Permissions.viewDefault]
    },
    {
        tooltip: 'Quản trị kho',
        name: MenuCategories.WHS,
        icon: './assets/media/svg/icons/Common/Warehouses.svg',
        url: '/warehouse-management',
        roles: [Permissions.viewDefault]
    },
    {
        tooltip: 'Quản trị thời tiết',
        name: MenuCategories.WET,
        icon: './assets/media/svg/icons/Common/Sun.svg',
        url: '/dashboard',
        roles: [Permissions.viewDefault]
    },
    {
        tooltip: 'Quản trị đất đai',
        name: MenuCategories.REES,
        icon: './assets/media/svg/icons/Common/MapTrifold.svg',
        url: '/dashboard',
        roles: [Permissions.viewDefault]
    },
    {
        tooltip: 'Quản trị sản xuất',
        name: MenuCategories.PROD,
        icon: './assets/media/svg/icons/Common/File.svg',
        url: '/dashboard',
        roles: [Permissions.viewDefault]
    },
    {
        tooltip: 'Tổng hợp báo cáo',
        name: MenuCategories.REPORT,
        icon: './assets/media/svg/icons/Common/Report.svg',
        url: '/dashboard',
        roles: [Permissions.viewDefault]
    },
]

export const SettingAside: PrimaryAsideInterface[] = [

    {
        tooltip: 'Cài đặt',
        name: MenuCategories.SET,
        icon: '../../../../../assets/media/svg/icons/Common/Setting.svg',
    },
    {
        tooltip: 'Người quản lý',
        name: MenuCategories.NOTICE,
        icon: './assets/media/svg/icons/Common/Users.svg',
    },
]

interface PrimaryAsideInterface {
    tooltip:string;
    name: string;
    icon: string;
    url?: string;
    roles?: string[];
}
