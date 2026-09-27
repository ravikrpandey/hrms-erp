import { Injectable, PipeTransform } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchDropdowndataService implements PipeTransform {

transform(value: any="0", searchTerm:any) {
  
return value.filter(function(search:any){
  return search.folder_name.toLowerCase().indexOf(searchTerm) > -1
})
}
}