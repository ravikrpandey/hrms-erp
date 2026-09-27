
import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appNumberComma]'
})

export class QuotationNmberCommaDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInput(event: Event) {
    const input = this.el.nativeElement;
    const value = input.value.replace(/,/g, ''); // Remove existing commas
    const formattedValue = this.formatNumber(value);
    input.value = formattedValue;
  }

  private formatNumber(value: string): string {
    if (!value) return '';
    const parts = value.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }
}
