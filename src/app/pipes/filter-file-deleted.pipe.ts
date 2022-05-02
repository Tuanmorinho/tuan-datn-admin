import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterFileDeleted'
})
export class FilterFileDeletedPipe implements PipeTransform {

  /**
   * 
   * @param files 
   * @param status //0: active; 1: deleted
   * @returns files
   */
  transform(files: any[], status: number): unknown {
    if(!files) return [];
    return files.filter(v => v.deleteFlag === status);
  }
}
