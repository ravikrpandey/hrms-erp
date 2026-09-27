import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dropdownSearchable'
})
export class DropdownSearchablePipe implements PipeTransform {

  transform(value: any, searchTerm:any) {
  
    // 
    // 

  let data = value.filter(function(search:any)
  {
    return search.fullName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
  })
  
  
  return data

  }
  }