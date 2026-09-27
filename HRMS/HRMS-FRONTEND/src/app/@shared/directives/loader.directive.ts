import { Directive, ElementRef, HostBinding, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appLoader]'
})
export class LoaderDirective {

  constructor(private el:ElementRef, private renderer:Renderer2) { }

  // @HostListener('window:scroll', ['$event'])
  // onWindowScroll(e:any) {
  // };
  
}
