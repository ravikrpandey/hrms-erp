import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [MatIconModule,CommonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent {
  @Input() type: string = 'submit';
  @Input() text: string = '';
  @Input() btn: string = '';
  @Input() btnClass: string = '';
  @Input() disabled: boolean = false;
  @Output() buttonClick = new EventEmitter<string>();

  onclickbtn() {
    this.buttonClick.emit();
  }
}
