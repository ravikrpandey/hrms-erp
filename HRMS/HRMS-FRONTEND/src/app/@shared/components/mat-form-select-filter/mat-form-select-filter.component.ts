import { Component, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-mat-form-select-filter',
  templateUrl: './mat-form-select-filter.component.html',
  styleUrls: ['./mat-form-select-filter.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MatFormSelectFilterComponent),
      multi: true,
    },
  ],
})
export class MatFormSelectFilterComponent
  implements OnInit, ControlValueAccessor
{
  private _items: any[] = [];

  @Input()
  set items(value: any[]) {
    this._items = value || [];
    this.filteredItems.next(this._items.slice());
  }

  get items(): any[] {
    return this._items;
  }
  @Input() disabled = false;
  @Input() displayKey: string | string[] = '';
  @Input() key: string | null = null;
  @Input() placeholder: string = 'Select';

  private _onDestroy = new Subject<void>();
  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  itemFilterCtrl = new FormControl();
  filteredItems: ReplaySubject<any[]> = new ReplaySubject(1);
  selectedValue: any;

  private onChange = (_: any) => {};
  private onTouched = () => {};

  ngOnInit() {
    this.itemFilterCtrl.valueChanges.pipe(debounceTime(100)).subscribe(() => {
      const search = this.itemFilterCtrl.value?.toLowerCase();
      if (!search) {
        this.filteredItems.next(this.items.slice());
        return;
      }

      this.filteredItems.next(
        this.items.filter((item) => {
          if (!this.isObject(item)) {
            return String(item).toLowerCase().includes(search);
          }

          // Handle string or string[]
          if (Array.isArray(this.displayKey)) {
            return this.displayKey.some((key) =>
              item[key]?.toString().toLowerCase().includes(search)
            );
          } else {
            return item[this.displayKey]
              ?.toString()
              .toLowerCase()
              .includes(search);
          }
        })
      );
    });
  }

  isObject(value: any): boolean {
    return value !== null && typeof value === 'object';
  }

  writeValue(value: any): void {
    this.selectedValue = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (isDisabled) {
      this.itemFilterCtrl.disable({ emitEvent: false });
    } else {
      this.itemFilterCtrl.enable({ emitEvent: false });
    }
  }

  onSelectionChange(value: any) {
    // if (this.key) {
    //   value = value[this.key];
    // }
    // if (this.selectedValue === value) {
    //   return; // No change, do nothing
    // }
    // // If the value is the same as the current selected value, do not update
    // if (this.singleSelect) {
    //   this.singleSelect.close();
    // }
    // // Update the selected value and notify the form control
    // if (this.isObject(value)) {
    //   value = { ...value }; // Create a shallow copy if it's an object
    // }
    // if (this.key && typeof value === 'object') {
    //   value = value[this.key]; // Use the key to get the value
    // }
    this.selectedValue = value;
    this.onChange(value);
    this.onTouched();
  }

  getDisplayText(item: any): string {
    if (!this.isObject(item)) {
      return String(item);
    }

    if (Array.isArray(this.displayKey)) {
      return this.displayKey
        .map((key) => item[key])
        .filter((val) => val) // remove null/undefined
        .join(' - ');
    }

    return item[this.displayKey] ?? '';
  }
}
