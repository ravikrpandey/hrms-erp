import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(value: any, searchTerm: any) {

    // 
    // 

    if (searchTerm) {
      let data = value.filter(function (search: any) {
        return search.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
      })
      // 
      return data
    } else {
      return value;
    }
  }
}