import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterSection'
})
export class FilterSectionPipe implements PipeTransform {

  transform(value: any[], filter: number): unknown {
    if (!filter) {
      return [];
    }
    return value.find(v => v.id === filter)?.sectionVms;
  }

}
