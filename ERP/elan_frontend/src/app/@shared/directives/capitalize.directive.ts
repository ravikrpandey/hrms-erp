import { Directive, ElementRef, HostListener, OnInit } from '@angular/core';

@Directive({
  selector: 'input[matInput], textarea[matInput], input:not([type=number]), textarea'
})
export class AutoCapitalizeDirective implements OnInit {

  constructor(private el: ElementRef) {}

  ngOnInit() {
    if (this.shouldSkip()) return;
    this.formatValue();
  }

  private shouldSkip(): boolean {
    const input = this.el.nativeElement as HTMLInputElement;

    if (input.hasAttribute('noCapitalize')) {
      return true;
    }

  
    if (input.type === 'email') {
      return true;
    }

    return false;
  }

  private formatValue() {
    if (this.shouldSkip()) return;
    const input = this.el.nativeElement as HTMLInputElement;
    if (input.value) {
      input.value = this.capitalize(input.value);
    }
  }

  private capitalize(value: string): string {
    return value
      .toLowerCase()
      .replace(/\b\w/g, char => char.toUpperCase());
  }

  @HostListener('input') onInputChange() {
    this.formatValue();
  }
}
