import { GeneralModel } from './general.model';

export interface InitDataModel {
    wattageUnits: GeneralModel[],
    weightUnits: GeneralModel[],
    volumeUnits: GeneralModel[],
    fuelTypes: GeneralModel[],
    transportVehicleTypes: GeneralModel[],
    purchaseOrderStatus: GeneralModel[],
    units: GeneralModel[],
    fertilizerTypes: GeneralModel[],
    agriculturalMachineTypes: GeneralModel[],
    shipmentOrderStatus: GeneralModel[],
    shipmentOrderTypes: GeneralModel[],
}