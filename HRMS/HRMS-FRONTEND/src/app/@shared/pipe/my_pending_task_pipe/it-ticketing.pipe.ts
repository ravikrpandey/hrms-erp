import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'itTicketing'
})
export class ItTicketingPipe implements PipeTransform {

  transform(value: any, searchVal: any){
    let inputVal = searchVal.trim().toLowerCase()
    return value?.filter(function(search:any){
      return search.ticket_raised_by.toLowerCase().indexOf(inputVal) > -1
    })
  }

}
