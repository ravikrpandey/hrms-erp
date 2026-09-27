import {
  Component,
  forwardRef,
  Input,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
  Inject,
  Injector,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { QuickModalComponent } from '../quick-modal/quick-modal.component';
import { StatemasterdialogComponent } from '../../../../@modules/itticketing/configurationalmaster/statemaster/statemasterdialog/statemasterdialog.component';
import { CityMasterDialogComponent } from '../../../../@modules/itticketing/configurationalmaster/city-master/city-master-dialog/city-master-dialog.component';
import { AccessControlService } from 'src/app/@shared/services/access-control.service';

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
  @Input() noneOption: boolean = true;
  @Input() displayKey: string | string[] = '';
  @Input() key: string | null = null;
  @Input() placeholder: string = 'Select';
  @Input() multiple: boolean = false;
  @Output() selectionChange = new EventEmitter<any>();
  @Input() masterName?: 'State' | 'City';
  @Input() parentId?: any;

  constructor(
    private dialog: MatDialog,
    private accessService: AccessControlService,
  ) {}

  hasWritePermission(): boolean {
    if (!this.masterName) return false;
    if (this.masterName === 'State') {
      return this.accessService.canWrite('configurational-master/state-master');
    }
    if (this.masterName === 'City') {
      return this.accessService.canWrite('configurational-master/city-master');
    }
    return false;
  }

  private _onDestroy = new Subject<void>();
  // @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

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
              item[key]?.toString().toLowerCase().includes(search),
            );
          } else {
            return item[this.displayKey]
              ?.toString()
              .toLowerCase()
              .includes(search);
          }
        }),
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
    this.selectionChange.emit({ value });
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

  openQuickAddDialog(id?: number) {
    if (!this.masterName) return;

    let targetComponent: any;
    let dataKey: string;
    let nameKey: string;
    let parentKey: string;

    if (this.masterName === 'State') {
      targetComponent = StatemasterdialogComponent;
      dataKey = 'states_id';
      nameKey = 'states_name';
      parentKey = 'countryss_id';
    } else if (this.masterName === 'City') {
      targetComponent = CityMasterDialogComponent;
      dataKey = 'city_id';
      nameKey = 'city_name';
      parentKey = 'states_id';
    }

    const dialogRef = this.dialog.open(QuickModalComponent, {
      width: '450px',
      data: {
        component: targetComponent,
        componentData: {
          id: id,
          parentId: this.parentId,
          fromDropdown: true,
          mode: id ? 'edit' : 'add',
        },
        title: (id ? 'Edit ' : 'Add New ') + this.placeholder,
      },
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        if (!id) {
          const newItem = { ...res };
          if (this.key && newItem[dataKey] !== undefined) {
            newItem[this.key] = newItem[dataKey];
          }
          this._items = [...this._items, newItem];
          this.filteredItems.next(this._items.slice());
          const newId = this.key ? newItem[this.key] : newItem;
          this.onSelectionChange(newId);
        } else {
          this._items = this._items.map((item) => {
            const currentId = this.key ? item[this.key] : item;
            if (Number(currentId) === Number(id)) {
              const updatedItem = { ...item, ...res };
              if (this.key && updatedItem[dataKey] !== undefined) {
                updatedItem[this.key] = updatedItem[dataKey];
              }
              return updatedItem;
            }
            return item;
          });
          this.filteredItems.next(this._items.slice());
          const currentVal = this.selectedValue;
          this.onSelectionChange(currentVal);
        }
      }
    });
  }
}
