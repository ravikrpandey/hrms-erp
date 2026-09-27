import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hrDashboardPipe'
})
export class HrDashboardPipePipe implements PipeTransform {

  transform(value: any, searchTerm:any) {
    
    
  
  return value.filter(function(search:any){
    return search.condidate_name.toLowerCase().indexOf(searchTerm) > -1
  })
  }
  }