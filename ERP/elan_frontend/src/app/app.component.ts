import {
  Component,
  HostListener,
  DoCheck,
  OnInit,
  ViewChild,
  Renderer2,
  ElementRef,
} from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, DoCheck {
  constructor(
    private router: Router,
    private renderer: Renderer2,
    private el: ElementRef
  ) { }

  ngOnInit(): void {
  }

  ngDoCheck(): void { }

  onClick(event: any) {
    const a = this.renderer.addClass(this.el.nativeElement, 'highlight');
  }

  @HostListener('window:click', ['$event'])
  onWindowClick(event: Event): void {
    this.onClick(event);
  }
}
