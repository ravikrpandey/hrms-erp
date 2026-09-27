import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  Output,
  inject,
} from '@angular/core';

@Directive({
  selector: '[appInfiniteScroll]',
  standalone: true,
})
export class InfiniteScrollDirective {
  @Input() scrollRoot?: HTMLElement;
  @Input() disabled = false;
  @Output() scrolled = new EventEmitter<void>();

  private anchor = inject(ElementRef).nativeElement;
  private zone = inject(NgZone);
  private observer!: IntersectionObserver;

  constructor() {
    this.zone.runOutsideAngular(() => {
      this.observer = new IntersectionObserver(
        ([entry]) => {
          if (!this.disabled && entry.isIntersecting) {
            this.zone.run(() => this.scrolled.emit());
          }
        },
        {
          root: this.scrollRoot || this.anchor.parentElement,
          threshold: 1.0,
        }
      );

      this.observer.observe(this.anchor);
    });
  }

  ngOnDestroy(): void {
    if (this.observer) this.observer.disconnect();
  }
}

