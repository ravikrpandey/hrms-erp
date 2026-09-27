import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'amount'
})
export class AmountPipe implements PipeTransform {

  transform(value: number): string {
    if (value === null || value === undefined || isNaN(value)) {
      return '';
    }
    value = +value
    const [integer, fraction] = value.toFixed(2).split('.');
  
    const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return `${formattedInteger},${fraction}`;
  }
}
