import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-title-select',
  templateUrl: './title-select.component.html',
  styleUrls: ['./title-select.component.scss']
})
export class TitleSelectComponent {
@Input() control!: FormControl; // parent form ka control bind karne ke liye

  @Output() selectionChange = new EventEmitter<string>(); // event parent ko bhejne ke liye

  titles: string[] = ['Mr', 'Mrs', 'Miss'];

  onSelectionChange(event: any) {
    this.selectionChange.emit(event.value);
  }
}
