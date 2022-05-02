import { ImagesModel } from './image.model';
import { WarehouseModel } from './warehouse.model';

export interface SKUModel extends WarehouseModel {
    id: string;
    groupCode: string,
    code: string,
    name: string,
    netWeight: string,
    images: ImagesModel[],
    weightUnit: string,
    unit: string,
    manufacture: string,
    grossWeight: string,
    susr04: string,
    susr05: string,
    susr06: string,
    susr07: string,
    susr08: string,
    susr09: string
}