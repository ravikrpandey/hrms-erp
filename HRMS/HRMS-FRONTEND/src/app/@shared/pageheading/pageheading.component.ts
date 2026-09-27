import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-pageheading',
  standalone: true,
  imports: [CommonModule, ButtonComponent, MatIconModule],
  templateUrl: './pageheading.component.html',
  styleUrls: ['./pageheading.component.css']
})
export class PageheadingComponent {
  @Input() pagename: string = '';
  @Input() backbuttonShow: boolean = false;

  backHistory(): void {
    window.history.back();
  }
}
