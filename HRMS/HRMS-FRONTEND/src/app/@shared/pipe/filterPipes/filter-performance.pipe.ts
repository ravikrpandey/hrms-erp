import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterPerformance'
})
export class FilterPerformancePipe implements PipeTransform {

  transform(value: any, searchVal: any) {
    let inputVal = searchVal.trim().toLowerCase()
    return value?.filter(function(search:any){
      return search.folder_name.toLowerCase().indexOf(inputVal) > -1
    })
  }

}
