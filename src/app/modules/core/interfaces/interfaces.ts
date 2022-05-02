export interface PermissionData {
    listUsers: any[];
    listDepartments: any[];
    listPositions: any[];
    listPositionLevels: any[];
}


export interface CommentType {
    isExtAudit?: boolean;
    isExtAudit2?: boolean;
    isECR?: boolean;
    typeMR?: number;
    isPrint?: boolean;
    isAuditAnnual?: boolean;
    isAuditAnnualChange?: boolean;
    isAuditAnnualReport?: boolean;
    isAuditReviewReport?: boolean;
    isAuditDepartment?: boolean;
    isCorrectiveReport?: boolean;
    isOCM?: boolean;
    isSOW?: boolean;
    isPCS?: boolean;
    isACC?: boolean;
    isACCReport?: boolean;
    isAddDraw?: boolean;
    isChangeDraw?: boolean;
    isCancelDraw?: boolean;
    isDrawEntry?: boolean;
    isOTI?: boolean;
    // EPR
    isEPR?: boolean;
    isWHdone?: boolean;
    //-----
    isEne?: boolean;

    isPrintDraw?: boolean;
    isMgm?: boolean;
    isRequestCancelMgm?: boolean;
    isRequestChangeMgm?: boolean;
    isDprEntry?: boolean;
    isAddDpr?: boolean;
    isChangeDpr?: boolean;
    isCancelDpr?: boolean;
    isMBO?: boolean;
    isMBOReport?: boolean;
    isRECIN?: boolean;
    isRECEX?: boolean;

    isAddMMA1?: boolean;
}

export interface RoleOfUser {
    isApproveCancel: boolean;
    isApprovePublish: boolean;
    isApproveUnPublish: boolean;
    isApproveView: boolean;
    isMasterDataAdd: boolean;
    isMasterDataDelete: boolean;
    isMasterDataUpdate: boolean;
    isMasterDataView: boolean;
    isRequestAdd: boolean;
    isRequestDelete: boolean;
    isRequestUpdate: boolean;
    isRequestView: boolean;
    isUtilityAdd: boolean;
    isUtilityDelete: boolean;
    isUtilityUpdate: boolean;
    isUtilityView: boolean;
    isVendorPortalComment: boolean;
    isVendorPortalDelete: boolean;
    isVendorPortalImport: boolean;
    isVendorPortalUpdate: boolean;
    isVendorPortalView: boolean;
    isDownload: boolean
}
