import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  TrackByFunction,
} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inputfield',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatCheckboxModule,
  ],
  templateUrl: './inputfield.component.html',
  styleUrls: ['./inputfield.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputfieldComponent {
  @Input() placeholder = '';
  @Input() type = 'text';
  @Input() labelname = '';
  @Input() required = false;
  @Input() selectoptions: any[] = [];
  @Input() selectvaluekey = 'id';
  @Input() selectshowvaluekey = 'roll';
  @Input() errorshow = '';
  @Input() maxLength: any = '800';
  @Input() readonly = false;
  @Input() disabled = false;
  @Input() rows = '3';
  @Input() cols = '20';
  @Input() disabledOptions: any[] = [];

  // Regular value (not signal)
  private _value: any = '';
trackBySelectValue: TrackByFunction<any>;
  @Input('model') set value(v: any) {
    this._value = v ?? '';
  }
  get valueSignal(): any {
    return this._value;
  }

  @Output() blurEvent = new EventEmitter<any>();
  @Output() modelChange = new EventEmitter<any>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectoptions']) {
      this.selectoptions = changes['selectoptions'].currentValue;
    }
  }

  onInput(event: any): void {
    let value: any;
    if (this.type === 'select') {
      value = event.target.value;
    } else if (this.type === 'checkbox') {
      value = event.target?.checked;
    } else if (this.type === 'date') {
      value = event.target.value || (event.target as HTMLInputElement).value;
    } else {
      value = (event.target as HTMLInputElement).value;
    }
    this._value = value;
    this.modelChange.emit(value);
  }

  onBlur(event: any): void {
    let value: any;
    if (this.type === 'select') {
      value = event.target.value;
    } else if (this.type === 'checkbox') {
      value = event.target?.checked;
    } else if (this.type === 'date') {
      value = event.target.value || (event.target as HTMLInputElement).value;
    } else {
      value = (event.target as HTMLInputElement).value;
    }
    this.blurEvent.emit(value);
  }

  onMultiSelectChange(event: Event) {
    const input = event.target as HTMLInputElement;
    let selected = [...(this.valueSignal || [])];

    if (input.checked) {
      selected.push(input.value);
    } else {
      selected = selected.filter((v) => v !== input.value);
    }

    this._value = selected;
    this.modelChange.emit(selected);
  }

  getValueforMultiSelect(values: any, key: any) {
    if (values.length > 0) {
      const array: any[] = [];
      let count = 0;
      values.forEach((a: any) => {
        const optionobj = this.selectoptions.find(
          (b: any) => b[this.selectvaluekey] === a,
        );
        if (optionobj) {
          array.push(optionobj[key]);
          count++;
        }
      });
      return array.length > 3
        ? `${array.slice(0, 3).toString()} + ${count - 3}`
        : array.toString();
    }
    return '';
  }

  getDisabledStatu(sloption: any) {
    return this.disabledOptions?.includes(sloption);
  }
}
