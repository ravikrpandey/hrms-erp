import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'empFilter'
})

export class EmpFilterPipe implements PipeTransform {
  transform(value: any[], searchTerm:any) {
  
    
    

  // return value.filter(function(search:any)
  // {
  //   return search.fullName.toLowerCase().indexOf(searchTerm) > -1
  // })
  // }

  let nameAuther = value?.filter(function(search:any)
  {
    return search.first_name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
  })
  
  
  return nameAuther

  }


}
