import { Component, Input, Output, EventEmitter, forwardRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-searchable-select',
  templateUrl: './searchable-select.component.html',
  styleUrls: ['./searchable-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchableSelectComponent),
      multi: true
    }
  ]
})
export class SearchableSelectComponent implements ControlValueAccessor, OnInit, OnChanges {
  @Input() options: any[] = [];
  @Input() displayKey: string = 'name';
  @Input() valueKey: string = 'id';
  @Input() placeholder: string = 'Select';
  @Input() searchPlaceholder: string = 'Search...';

  // Optional event emitter
  @Output() optionSelected = new EventEmitter<any>();

  searchText: string = '';
  filteredOptions: any[] = [];
  value: any;

  private onChange: any = (_: any) => {};
  private onTouched: any = () => {};
  showNoData: boolean = false;
  noDataTimeout: any;

  ngOnInit() {
    if (Array.isArray(this.options)) {
      this.filteredOptions = [...this.options];
    } else {
      this.filteredOptions = [];
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['options'] && Array.isArray(this.options)) {
      this.filteredOptions = [...this.options];
    } else {
      this.filteredOptions = [];
    }
  }

  filterOptions() {
    const q = (this.searchText || '').trim().toLowerCase();

    // Reset previous timeout if any
    if (this.noDataTimeout) {
      clearTimeout(this.noDataTimeout);
    }

    if (!q) {
      this.filteredOptions = [...this.options];
      this.showNoData = false;
      return;
    }

    this.filteredOptions = this.options.filter(opt =>
      String(opt[this.displayKey] || '').toLowerCase().includes(q)
    );

    // Show "No data found" message if none found
    this.showNoData = this.filteredOptions.length === 0;

    if (this.showNoData) {
      // Auto clear after 2 seconds
      this.noDataTimeout = setTimeout(() => {
        this.searchText = '';
        this.filteredOptions = [...this.options];
        this.showNoData = false;
      }, 2000);
    }
  }

  ngOnDestroy() {
    if (this.noDataTimeout) clearTimeout(this.noDataTimeout);
  }

  selectOption(event: any) {
    const selectedOption = event.option.value;

    if (!Array.isArray(this.options)) {
      return; // prevent errors
    }

    const found = this.options.find(
      opt =>
        (opt[this.displayKey] || '').trim().toLowerCase() ===
        (selectedOption || '').trim().toLowerCase()
    );

    if (found) {
      this.value = found[this.valueKey];
      this.searchText = found[this.displayKey];
      this.onChange(this.value);
      this.onTouched();

      if (this.optionSelected.observers.length > 0) {
        this.optionSelected.emit(found);
      }
    }
  }

  writeValue(value: any): void {
    this.value = value;
    if (Array.isArray(this.options)) {
      const found = this.options.find(opt => opt[this.valueKey] === value);
      this.searchText = found ? found[this.displayKey] : '';
    } else {
      this.searchText = '';
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {}

  clearSelection() {
    this.value = null;
    this.searchText = '';
    this.filteredOptions = [...this.options];
    this.onChange(this.value);
    this.onTouched();

    // Emit null or empty object to parent
    if (this.optionSelected.observers.length > 0) {
      this.optionSelected.emit(null);
    }
  }
}
