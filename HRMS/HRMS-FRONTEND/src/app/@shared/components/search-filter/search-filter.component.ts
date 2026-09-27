import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription, debounceTime, distinctUntilChanged, tap } from 'rxjs';

export interface FilteredData<T = any> {
  data: T[];
  searchString: string;
}

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule
  ],
  selector: 'app-search-filter',
  template: `
    <mat-form-field class="search-filter" appearance="fill">
          <input
            matInput
            class="search-input"
            [placeholder]="placeholder || 'Search...'"
            type="text"
            [formControl]="searchControl"
            maxLength="150"
            [attr.aria-label]="placeholder"
            (keydown.enter)="$event.stopPropagation()"
            (keydown.arrowUp)="$event.stopPropagation()"
            (keydown.arrowDown)="$event.stopPropagation()"
            (keydown.space)="$event.stopPropagation()"
          />
      <span matSuffix *ngIf="loading" class="spinner-container">
        <mat-progress-spinner
          color="primary"
          mode="indeterminate"
          diameter="20"
          value="75">
        </mat-progress-spinner>
      </span>
      <button
        *ngIf="showResetButton"
        mat-icon-button
        matSuffix
        (click)="resetSearchInput()"
        [attr.aria-label]="'Reset'"
      >
        <mat-icon>replay</mat-icon>
      </button>
    </mat-form-field>
    <span *ngIf="noResult" class="no-result-hint"> No Data </span>
  `,
  styles: [`
    :host {
      display: block;
      position: sticky;
      top: 0;
      left: 0;
      width: 100%;
      background: white;
      z-index: 1000;
      padding: 1.5px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .search-filter {
      width: 100%;
      margin-bottom: 8px;
    }

    .spinner-container {
      padding: 0 10px;
      display: flex;
      align-items: center;
    }

    .no-result-hint {
      width: 100%;
      font-size:12px;
      color:rgb(57, 56, 56);
      letter-spacing: 0.15px;
      text-align: center;
      width: 100%;
      display: inline-block;
    }

    ::ng-deep .search-filter .mat-mdc-form-field-subscript-wrapper {
      height: 0 !important;
    }

    /* Ensure background stays white */
    ::ng-deep .search-filter .mdc-text-field--filled:not(.mdc-text-field--disabled) {
      background-color: #fff !important;
    }
  `]
})
export class SearchFilterComponent<T extends Record<string, any>> implements OnInit, OnDestroy {
  @Input() array: T[] = [];
  @Input() searchFields: string[] = [];
  @Input() placeholder = 'Search...';
  @Input() multiSelect = false;
  @Input() valueKey = ''; // Unique key for each item
  @Input() parentFormControl: FormControl | null = null;

  @Output() filteredReturn = new EventEmitter<FilteredData<T>>();
  @Output() searchChange = new EventEmitter<T[]>();

  noResult = false;
  loading = false;
  searchControl = new FormControl<string>('');

  private previousSelectedValues: any[] = [];
  private searchControlSubs?: Subscription;
  private matSelectSubs?: Subscription;

  constructor(
    private matSelect: MatSelect,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    if (this.multiSelect && !this.valueKey) {
      this.showErrorSnackbar('ValueKey is required in multi-select search filter!');
      return;
    }

    this.setupSearchControl();
    this.setupMatSelectListener();
  }

  ngOnDestroy(): void {
    this.searchControlSubs?.unsubscribe();
    this.matSelectSubs?.unsubscribe();
  }

  get showResetButton(): boolean {
    return !this.loading && !!this.searchControl.value;
  }

  private setupSearchControl(): void {
    this.searchControlSubs = this.searchControl.valueChanges.pipe(
      tap((val: string | null) => {
        this.loading = true;
        this.noResult = false;
      }),
      debounceTime(250),
      distinctUntilChanged()
    ).subscribe((searchText) => {
      this.applyFilter(searchText || '');
      this.loading = false;
    });
  }

  private setupMatSelectListener(): void {
    this.matSelectSubs = this.matSelect.openedChange.subscribe((isOpen: boolean) => {
      if (!isOpen) {
        if (this.multiSelect) {
          this.restoreSelectedValues();
        }
        this.searchControl.reset();
        this.emitDefaultReturn();
      }
    });
  }

  private showErrorSnackbar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 2500,
      panelClass: ['error-snackbar']
    });
  }

  private restoreSelectedValues(): void {
    const currentValues = this.matSelect.ngControl?.value || [];
    const newValues = [...new Set([...this.previousSelectedValues, ...currentValues])];
    this.matSelect.ngControl?.control?.setValue(newValues);
  }

  private emitDefaultReturn(): void {
    this.filteredReturn.emit({
      data: this.array,
      searchString: this.searchControl.value || ''
    });
  }

  applyFilter(searchText: string): void {
    if (!searchText.trim()) {
      this.emitDefaultReturn();
      return;
    }

    if (this.multiSelect) {
      this.previousSelectedValues = this.matSelect.ngControl?.value || [];
    }

    let filtered = this.array.filter(item =>
      this.searchFields?.length
        ? this.searchFields.some(field =>
          item[field]?.toString().toLowerCase().includes(searchText.toLowerCase())
        )
        : JSON.stringify(item).toLowerCase().includes(searchText.toLowerCase())
    );

    if (this.valueKey) {
      const selectedItems = this.array.filter(item =>
        this.previousSelectedValues.includes(item[this.valueKey])
      );
      const finalFilteredList = [
        ...new Map(
          [...selectedItems, ...filtered].map(item => [item[this.valueKey], item])
        ).values()
      ];
      this.noResult = finalFilteredList.length === 0;
      this.filteredReturn.emit({
        data: finalFilteredList,
        searchString: searchText
      });
    } else {
      this.noResult = filtered.length === 0;
      this.filteredReturn.emit({
        data: filtered,
        searchString: searchText
      });
    }
  }

  resetSearchInput(): void {
    this.searchControl.setValue('');
    this.noResult = false;
    this.loading = false;
    this.emitDefaultReturn();
  }
}
