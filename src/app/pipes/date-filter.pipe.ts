import {Pipe, PipeTransform} from '@angular/core';
import {DatePipe} from '@angular/common';

@Pipe({
  name: 'dateFilter',
})
export class DateFilterPipe implements PipeTransform {

  constructor(private datePipe: DatePipe) {
  }

  transform(value: any, format?: string): any {
    if (!value) {
      return '';
    }
    format = format || 'short';
    return value ? this.datePipe.transform(value, format) : '';
  }
}
