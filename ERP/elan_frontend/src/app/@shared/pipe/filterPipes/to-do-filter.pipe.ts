import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toDoFilter'
})
export class ToDoFilterPipe implements PipeTransform {

  transform(value: any, searchVal: any) {
    let inputVal = searchVal.trim().toLowerCase()
    return value?.filter(function(search:any){
      return search.course_name?.toLowerCase().indexOf(inputVal) > -1
    })
  }

}
