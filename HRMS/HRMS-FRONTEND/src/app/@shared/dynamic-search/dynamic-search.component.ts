import { Component, input, output, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-dynamic-search',
  standalone:true,
  imports: [MatFormFieldModule, MatIconModule, MatInputModule],
  templateUrl: './dynamic-search.component.html',
  styleUrls:[ './dynamic-search.component.css']
})
export class DynamicSearchComponent {

  filterTextChange = output<string>();

  onFilterTextBoxChanged(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.filterTextChange.emit(value);
  }
}
