import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-wrapper',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.scss'],
})
export class WrapperComponent {
  @Input() title = '';
  @Input() subTitle = '';
  @Input() subheading = '';
  @Input() buttonText = '';
  @Input() buttonLink = '';
  @Input() isBack: boolean = false;
  @Output() buttonClick = new EventEmitter<void>();
  @Input() showActions: boolean = false;
  @Input() actions: {
    label: string;
    icon?: string;
    callback: () => void;
    color?: string;
  }[] = [];

  back() {
    window.history.back();
  }

  trackIndex(index: number, item: any): number {
    return index;
  }
}
