import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cityFilterValue'
})
export class CityFilterValuePipe implements PipeTransform {

  transform(items: any[], value: string): any[] {
    if (!items) {
        return [];
    }
    if (!value) {
        return items;
    }


    return items.filter( singleItem => singleItem.city_name.toLowerCase().includes(value));
}

}
