import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'listPrint'
})
export class ListPrintPipe implements PipeTransform {

  transform = (objects: any = []) => {
    return Object.values(objects);
  }

}
