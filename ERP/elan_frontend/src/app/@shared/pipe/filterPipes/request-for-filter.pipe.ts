import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'requestForFilter'
})
export class RequestForFilterPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
