export interface InitDataHouseHoldModel {
    householdStatus: GeneralModel[];
    genders: GeneralModel[];
    identifyTypes: GeneralModel[];
    marriageStates: GeneralModel[];
    memberRoles: GeneralModel[];
    farmingContractStatus: GeneralModel[];
    paymentTypes: GeneralModel[];
    paymentCurrencyTypes: GeneralModel[];
    banks: GeneralModel[];
    countries: GeneralModel[];
}

export interface GeneralModel {
    id?: number;
    code: string;
    value: string
}