import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CurrencyMasterRoutingModule } from './currency-master-routing.module';
import { CurrencyMasterComponent } from './currency-master.component';
import { CurrencyMasterActionComponent } from './currency-master-action/currency-master-action.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { CurrencyMasterDialogComponent } from './currency-master-dialog/currency-master-dialog.component';
import { CurrencyStatusComponent } from './currency-master-action/currency-status/currency-status.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectFilterModule } from 'mat-select-filter';
@NgModule({
  declarations: [
    CurrencyMasterComponent,
    CurrencyMasterActionComponent,
    CurrencyMasterDialogComponent,
    CurrencyStatusComponent
  ],
  imports: [
    CommonModule,
    CurrencyMasterRoutingModule,
    MaterialModule,
    AgGridModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatDialogModule,
    MatExpansionModule,
    MatSidenavModule,
    MatListModule,
    MatSelectFilterModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatIconModule,
    MatTooltipModule
  ]
})
export class CurrencyMasterModule { }
