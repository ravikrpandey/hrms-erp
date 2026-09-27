import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({
    name: 'filter_company_name'
})

@Injectable()
export class FilterPipe implements PipeTransform {
    transform(items: any[], value: string): any[] {
        if (!items) {
            return [];
        }
        if (!value) {
            return items;
        }
       
       
        return items.filter( singleItem => singleItem.associated_company.toLowerCase().includes(value));
    }
}
