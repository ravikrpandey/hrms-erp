import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'segmentVideoSearch'
})
export class SegmentVideoSearchPipe implements PipeTransform {

  transform(value: any, searchVal: any) {
    let inputVal = searchVal.trim().toLowerCase()
    return value?.filter(function(search:any){
      return search.segment.toLowerCase().indexOf(inputVal) > -1
    })
  }

}
