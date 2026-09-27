import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'categoryVideoSearch'
})
export class CategoryVideoSearchPipe implements PipeTransform {

  transform(value: any, searchVal: any) {
    let inputVal = searchVal.trim().toLowerCase()
    return value?.filter(function(search:any){
      return search.category.toLowerCase().indexOf(inputVal) > -1
      || search.segment.toLowerCase().indexOf(inputVal) > -1
    })
  }

}
