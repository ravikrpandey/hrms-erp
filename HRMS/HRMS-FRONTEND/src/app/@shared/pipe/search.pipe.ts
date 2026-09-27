//pipe code

import { Pipe, PipeTransform } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

transform(value: any, searchTerm:any) {
  
  

return value.filter(function(search:any){
  return search.first_name.toLowerCase().indexOf(searchTerm) > -1
})
}
}