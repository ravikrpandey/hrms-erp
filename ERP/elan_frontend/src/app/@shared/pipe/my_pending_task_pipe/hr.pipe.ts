import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hR'
})
export class HRPipe implements PipeTransform {

  transform(value: any, searchVal: any) {
    let inputVal = searchVal.trim().toLowerCase()
    return value?.filter(function(search:any){
      return search.condidate_name.toLowerCase().indexOf(inputVal) > -1
    })
  }

}
