import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'indianCurrency'
})
export class IndianCurrencyPipe implements PipeTransform {

  transform(value: any): string {
    if (value === null || value === undefined || isNaN(value)) {
      return '0.00';
    }

    const number = parseFloat(value);
    const formatted = number.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return formatted;
  }
}
