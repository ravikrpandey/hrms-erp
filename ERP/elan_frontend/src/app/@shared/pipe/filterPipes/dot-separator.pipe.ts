import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dotSeparator'
})
export class DotSeparatorPipe implements PipeTransform {


    
  transform(value: number | string, ...args: unknown[]): string {
    if (!value) return value?.toString();

    // Convert value to a string, in case it's a number
    let stringValue = value.toString();
console.log(stringValue,'stringValue<<<<<<<<<<<');

    // Split the string into integer and decimal parts
    const [integerPart, decimalPart] = stringValue.split('.');

    // Format the integer part with dots as thousand separators
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
console.log(decimalPart,'decimalPart<<<<<<<<<<<<');
const valueCheck = formattedInteger;
const firstChar = valueCheck.charAt(0);
const lastChar = valueCheck.charAt(valueCheck.length - 1); 
if(firstChar == '('){
  const value = formattedInteger;
  const newValue = value.replace(/^\(|\)$/g, '');
  console.log(newValue);
  console.log(firstChar, lastChar,'<<<<<<<<<<<1');
  var formattedDecimal:any = decimalPart ? `,${decimalPart.slice(0, 2)}` : ',00';
  return `(${newValue + formattedDecimal})`;

}else{
  var formattedDecimal:any = decimalPart ? `,${decimalPart.slice(0, 2)}` : ',00';

return formattedInteger + formattedDecimal;

}

  }

}
