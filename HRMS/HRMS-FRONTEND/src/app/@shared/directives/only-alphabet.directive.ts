// alphabetic.directive.ts

import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[onlyAlphabet]'
})
export class OnlyAlphabetDirective {

  constructor() { }

  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    const charCode = event.which || event.keyCode;
    const charStr = String.fromCharCode(charCode);
    const isAlphabetic = /^[A-Za-z\s]*$/.test(charStr); // Added \s for space
    if (!isAlphabetic) {
      event.preventDefault();
    }
  }
}
