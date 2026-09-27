import { Component } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-custom-date-picker',
  template: `
    <input
      type="date"
      (change)="onDateChange($event)"
      [(ngModel)]="dateValue"
      class="date-picker"
    />
  `,
  styles: [`
    .date-picker {
      width: 100%; 
      box-sizing: border-box; 
      padding: 0px; 
      border: 0px solid #ccc; 
      border-radius: 4px; 
      background-color: #f9f9f9; 
      font-size: 13px; 
    }
  `]
})
export class CustomDatePickerComponent implements ICellEditorAngularComp {
  public dateValue: string;

  private params: any;

  agInit(params: any): void {
    this.params = params;
    this.dateValue = params.value; // Initial value
  }

  getValue() {
    return this.dateValue; // Return the selected date
  }

  onDateChange(event: any) {
    this.dateValue = event.target.value; // Update date value on change
  }
}
