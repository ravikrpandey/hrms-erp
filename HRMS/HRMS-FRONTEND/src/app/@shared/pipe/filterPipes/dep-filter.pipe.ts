import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'depFilter'
})
export class DepFilterPipe implements PipeTransform {

  transform(value: any[], searchTerm:any) {
  
    
    

  // return value.filter(function(search:any)
  // {
  //   return search.fullName.toLowerCase().indexOf(searchTerm) > -1
  // })
  // }

  let nameAuther = value?.filter(function(search:any)
  {
    return search.department_name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
  })
  
  
  return nameAuther

  }
}
