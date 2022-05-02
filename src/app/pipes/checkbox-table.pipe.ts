import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'checkboxTable'
})

export class CheckboxTablePipe implements PipeTransform {
    constructor() { }

    transform(item: any ,ids: any[]) {
        if (!ids || ids.length === 0) {
            return false;
        }
        return item.id ? ids.includes(item.id) : false
    }
}