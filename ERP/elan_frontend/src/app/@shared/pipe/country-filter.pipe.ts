import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({
    name: 'country_filter'
})

@Injectable()
export class CountryFilterPipe implements PipeTransform {
    transform(items: any[], value: string): any[] {
        if (!items) {
            return [];
        }
        if (!value) {
            return items;
        }


        return items.filter( singleItem => singleItem.countryss_name.toLowerCase().includes(value));
    }
}
