import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stateFilterValue'
})
export class StateFilterValuePipe implements PipeTransform {

  transform(items: any[], value: string): any[] {
    if (!items) {
        return [];
    }
    if (!value) {
        return items;
    }


    return items.filter( singleItem => singleItem.states_name.toLowerCase().includes(value));
}

}
