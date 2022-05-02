import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterRangeSettingDetails'
})
export class FilterRangeSettingDetailsPipe implements PipeTransform {

  /** 
   * @param value 
   * @param document 
   * @param type (0: loại bình thường, 1: báo cáo khắc phục)
   * @returns 
   */
  transform(value: any[], id: any): unknown {
    return value?.find(v => v.id === id)?.rangeSettingDetails;
  }
}
