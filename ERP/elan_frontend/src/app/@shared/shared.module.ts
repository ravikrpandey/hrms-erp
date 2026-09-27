import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { IndianCurrencyPipe } from './indian-currency/indian-currency.pipe';
import { SearchableSelectComponent } from './searchable-select/searchable-select.component';
import { AgGridTooltipComponent } from './components/ag-grid-tooltip/ag-grid-tooltip.component';
import { LedgerPreviewComponent } from './ledgerPreview/ledger-preview/ledger-preview.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { EmpListDialogComponent } from './components/emp-list-dialog/emp-list-dialog.component';
import { DialogeCalendarEventComponent } from './components/dialog-calendar-event/dialog-calendar-event.component';

@NgModule({
  declarations: [
    IndianCurrencyPipe,
    SearchableSelectComponent,
    AgGridTooltipComponent,
    LedgerPreviewComponent,
    ChangePasswordComponent,
    EmpListDialogComponent,
    DialogeCalendarEventComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatAutocompleteModule,
    MatIconModule,
    NgxMatSelectSearchModule,
    MatDialogModule,
    MatButtonModule
  ],
  exports: [
    IndianCurrencyPipe,
    SearchableSelectComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatIconModule,
    ChangePasswordComponent,
    EmpListDialogComponent,
    DialogeCalendarEventComponent,
  ]
})
export class SharedModule { }
